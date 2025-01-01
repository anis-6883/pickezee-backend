import { NextFunction, Response } from "express";
import Joi from "joi";
import { IApiRequest } from "../configs/interfaces";
import { apiResponse, formatErrorMsg } from "../helpers/index";

export const requestValidate =
  (schema: Joi.Schema) =>
  async (req: IApiRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = schema.validate(req.body);
      if (result.error) return apiResponse(res, 400, false, formatErrorMsg(result));

      req.result = result.value;
      return next();
    } catch (err) {
      console.error(err, "err");
      return apiResponse(res, 401, false, "Unauthorized Request!");
    }
  };
