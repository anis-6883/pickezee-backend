import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { IApiRequest } from "../configs/interfaces";
import { apiResponse, hashToken } from "../helpers";
import Session from "../models/session";
import User from "../models/user";

export const authAndPermissionCheck =
  (role: string | string[], checkPermission: boolean = true) =>
  async (req: IApiRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.headers?.authorization?.replace("Bearer ", "");
      if (!token) return apiResponse(res, 401, false, "Unauthorized Request!");

      const decoded: any = jwt.verify(token, process.env.APP_SECRET!);
      const hasPermission = Array.isArray(role) ? role.includes(decoded.role) : role === decoded.role;

      if (checkPermission && !hasPermission) {
        return apiResponse(res, 403, false, "You are not authorized to perform this action!");
      }

      const session = await Session.findOne({
        where: {
          userId: decoded.id,
          token: hashToken(token),
          expireAt: {
            [Op.gt]: new Date(), // Ensures ExpireAt > Current Time
          },
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password"],
            },
          },
        ],
      });

      if (!session) return res.status(401).json({ message: "Session expired!" });

      req.user = session.user;
      req.token = token;
      req.role = decoded.role;
      req.otp = decoded?.otp || undefined;

      return next();
    } catch (err) {
      console.error(err, "err");
      return apiResponse(res, 401, false, "Unauthorized Request!");
    }
  };
