import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { deleteImageFromCloudinary } from "../../../configs/cloudinary";
import { ROLE } from "../../../configs/constants";
import { IApiRequest, ICloudinaryResult } from "../../../configs/interfaces";
import { apiResponse, asyncHandler, exclude, generateSignature, hashToken } from "../../../helpers/index";
import Session from "../../../models/session";
import User from "../../../models/user";

/**
 * Admin Registration
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const adminRegister = asyncHandler(async (req: IApiRequest, res: Response) => {
  const result = req.result;

  const existingEmail = await User.findOne({ where: { email: result.email } });
  if (existingEmail) return apiResponse(res, 409, false, "This email already exists!");

  result.password = await bcrypt.hash(result.password, 10);
  result.role = ROLE.ADMIN;
  result.provider = "email";
  result.emailVerified = true;
  result.createdAt = new Date().toISOString();

  await User.create(result);

  return apiResponse(res, 201, true, "Admin has registered successfully!");
});

/**
 * Admin Login
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const adminLogin = asyncHandler(async (req: IApiRequest, res: Response) => {
  const result = req.result;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  const admin = await User.findOne({ where: { email: result.email } });
  if (!admin) return apiResponse(res, 401, false, "Invalid credentials!");

  const isPasswordValid = await bcrypt.compare(result.password, admin.password);
  if (!isPasswordValid) return apiResponse(res, 401, false, "Invalid password!");

  const token = generateSignature({ id: admin.id, role: admin.role }, "30d");
  const hashedToken = hashToken(token);

  const activeSessions = await Session.findAll({ where: { userId: admin.id }, order: [["createdAt", "ASC"]] });

  // Active Session Limit is 3
  if (activeSessions.length >= 3) {
    await Session.destroy({
      where: {
        id: activeSessions[0].id,
      },
    });
  }

  await Session.create({
    userId: admin.id,
    token: hashedToken,
    userAgent: userAgent,
    ipAddress: ipAddress,
    lastSeen: new Date(),
    expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
  });

  const data = exclude(admin.dataValues, ["password"]);
  data.token = token;

  return apiResponse(res, 200, true, "Admin login successfully!", data);
});

/**
 * Admin Profile
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const adminProfile = asyncHandler(async (req: IApiRequest, res: Response) => {
  if (!req.user) return apiResponse(res, 401, false, "Unauthorized Request!");
  return apiResponse(res, 200, true, "Admin profile fetched successfully!", req.user);
});

/**
 * Update Admin Profile
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const updateAdminProfile = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { softDeleted, ...updatedBody } = req.result;

  const existingSuperAdmin = await User.findOne({
    where: { email: updatedBody?.email ?? "", id: { [Op.ne]: req.user.id } },
  });
  if (existingSuperAdmin) return apiResponse(res, 409, false, "This email already exists!");

  // File Validation
  if (req.hasFile) {
    const result: ICloudinaryResult = await req?.fileObject;
    if (result.status) updatedBody.image = result?.public_id;

    const prevImage = await User.findByPk(req.user.id, { attributes: ["image"] });
    if (result?.status && prevImage?.image) deleteImageFromCloudinary(prevImage?.image);
  }

  const admin = await User.update(updatedBody, { where: { id: req.user.id } });
  if (!admin[0]) return apiResponse(res, 404, false, "Admin not found!");

  return apiResponse(res, 200, true, "Admin profile updated successfully!");
});

/**
 * Admin Changed Password
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const adminChangePassword = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { oldPassword, newPassword } = req.result;
  const admin = await User.findByPk(req.user.id);

  const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
  if (!isPasswordValid) throw "Old password is incorrect!";

  const isSame = await bcrypt.compare(newPassword, admin.password);
  if (isSame) throw "New password cannot be same as old password!";

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;

  await admin.save({ fields: ["password"] });

  return apiResponse(res, 200, true, "Admin password has been changed successfully!");
});
