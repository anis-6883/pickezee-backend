import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ROLE } from "../../../configs/constants";
import { apiResponse, asyncHandler } from "../../../helpers/index";
import User from "../../../models/user";
import { superAdminRegisterSchema } from "./validation";

/**
 * Super Admin Registration
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const superAdminRegistration = asyncHandler(async (req: Request, res: Response) => {
  const result = await superAdminRegisterSchema.validateAsync(req.body);

  const existingAdmin = await User.findOne({ where: { email: result.email } });
  if (existingAdmin) return apiResponse(res, 409, false, "This Super Admin already exists!");

  result.password = await bcrypt.hash(result.password, 10);
  result.role = ROLE.ADMIN;
  result.provider = "email";
  result.emailVerified = true;

  await User.create(result);

  return apiResponse(res, 201, true, "Super admin have registered successfully!");
});
