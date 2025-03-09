import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { IApiRequest } from "../configs/interfaces";
import { apiResponse, hashToken } from "../helpers";
import Session from "../models/session";

export const authAndPermission =
  (role: string | string[], checkPermission: boolean = true, otpCheck: boolean = false) =>
  async (req: IApiRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.headers?.authorization?.replace("Bearer ", "");
      if (!token) return apiResponse(res, 401, false, "Unauthorized Request!");

      const decoded: any = jwt.verify(token, process.env.APP_SECRET!);
      const hasPermission = Array.isArray(role) ? role.includes(decoded.role) : role === decoded.role;

      if (checkPermission && !hasPermission) {
        return apiResponse(res, 403, false, "You are not authorized to perform this action!");
      }

      if (!otpCheck) {
        const session = await Session.findOne({
          where: {
            userId: decoded.id,
            token: hashToken(token),
            expireAt: {
              [Op.gt]: new Date(), // Ensures ExpireAt > Current Time
            },
          },
        });

        if (!session) return res.status(401).json({ message: "Session expired!" });
      }

      req.id = decoded.id;
      req.token = token;
      req.role = decoded.role;
      req.otp = decoded?.otp || undefined;
      req.otpExp = decoded?.otpExp || undefined;

      return next();
    } catch (err) {
      console.error(err, "err");
      return apiResponse(res, 401, false, "Unauthorized Request!");
    }
  };
