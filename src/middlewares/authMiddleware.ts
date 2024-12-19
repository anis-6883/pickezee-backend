import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_KEY } from "../configs/constants";
import { IApiRequest, IJWTQuery } from "../configs/interfaces";
import { apiResponse } from "../helpers";
import User from "../models/user";

export const authAndPermissionCheck =
  (role: string | string[], checkPermission: boolean = true, tokenCheck: boolean = false) =>
  async (req: IApiRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token =
        req?.cookies?.temp || req.headers?.authorization?.replace("Bearer ", "") || req?.cookies?.[COOKIE_KEY];

      if (!token) return apiResponse(res, 401, false, "Unauthorized Request!");

      const decoded: any = jwt.verify(token, process.env.APP_SECRET!);
      const hasPermission = Array.isArray(role) ? role.includes(decoded.role) : role === decoded.role;

      if (checkPermission && !hasPermission) {
        return apiResponse(res, 403, false, "You are not authorized to perform this action!");
      }

      const query: IJWTQuery = { email: decoded?.email };
      if (tokenCheck) query.token = token;

      let user = await User.findOne({ where: query, attributes: { exclude: ["password"] } });
      if (!user) return apiResponse(res, 401, false, "Unauthorized Request!");

      req.user = user;
      req.token = token;
      req.role = decoded.role;
      req.otp = decoded?.otp || undefined;

      return next();
    } catch (err) {
      console.error(err, "err");
      return apiResponse(res, 401, false, "Unauthorized Request!");
    }
  };
