import { NextFunction, Response } from "express";
import Joi from "joi";
import { uploadImageIntoCloudinary } from "../configs/cloudinary";
import { IApiRequest } from "../configs/interfaces";
import { apiResponse, fileValidation, formatErrorMsg } from "../helpers/index";

export const requestValidate =
  (schema: Joi.Schema, folderName: string = "common") =>
  async (req: IApiRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = schema.validate(req.body);
      if (result.error) return apiResponse(res, 400, false, formatErrorMsg(result));

      req.result = result.value;
      req.hasFile = false;

      // File Validation
      if (req?.file) {
        const { status, message } = fileValidation(req.file, undefined, ["image/jpeg", "image/png", "image/jpg"]);
        if (!status) return apiResponse(res, 400, false, "Invalid Request!", { image: message });

        req.hasFile = true;
        req.fileObject = [uploadImageIntoCloudinary(req.file, folderName)];
      }

      return next();
    } catch (err) {
      console.error(err, "err");
      return apiResponse(res, 401, false, "Unauthorized Request!");
    }
  };
