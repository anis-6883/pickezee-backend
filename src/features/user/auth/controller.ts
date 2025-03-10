import bcrypt from "bcrypt";
import { Response } from "express";
import { deleteImageFromCloudinary } from "../../../configs/cloudinary";
import { ROLE } from "../../../configs/constants";
import { IApiRequest, ICloudinaryResult } from "../../../configs/interfaces";
import {
  apiResponse,
  asyncHandler,
  exclude,
  generateSignature,
  getRandomInteger,
  hashToken,
} from "../../../helpers/index";
import Session from "../../../models/session";
import User from "../../../models/user";
import { sendVerificationEmail } from "./service";

/**
 * User Registration
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userRegister = asyncHandler(async (req: IApiRequest, res: Response) => {
  const result = req.result;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  let existingUser = await User.findOne({ where: { email: result.email } });

  // Validation 1: Existing Verified Email
  if (existingUser && existingUser.emailVerified && result.provider === "email") {
    return apiResponse(res, 409, false, "Please log in using the email and password you registered with!");
  }

  // Validation 2: Delete Un-verified Account
  if (existingUser && !existingUser.emailVerified && result.provider === "email") {
    await User.destroy({
      where: { id: existingUser.id },
    });
  }

  // Validation 3: Existing Verified Email with Another Provider
  if (existingUser && existingUser.emailVerified && result.provider !== existingUser.provider) {
    const providerMessages: Record<string, string> = {
      google: "Your account was registered using Google. Please log in with Google!",
      default: "Please log in using the email and password you registered with!",
    };

    const message = providerMessages[existingUser.provider] || providerMessages["default"];
    return apiResponse(res, 401, false, message);
  }

  // Process 1: Sign Up with Social Account
  if (result.provider !== "email") {
    // Check 1: Existing Email with Social Account
    if (!existingUser) {
      result.password = await bcrypt.hash("123456", 10);
      result.role = ROLE.USER;
      result.emailVerified = true;
      result.dialCode = result?.phone ? "+880" : null;
      result.phone = result?.phone ? result.phone.replace(/^0+/, "") : null;
      result.status = true;

      existingUser = await User.create(result);
    }

    const token = generateSignature({ id: existingUser.id, role: existingUser.role }, 30 * 24 * 60 * 60);
    const hashedToken = hashToken(token);

    const activeSessions = await Session.findAll({
      where: { userId: existingUser.id },
      order: [["createdAt", "ASC"]],
    });

    // Validation 4: Active Session Limit is 3
    if (activeSessions.length >= 3) {
      await Session.destroy({
        where: {
          id: activeSessions[0].id,
        },
      });
    }

    await Session.create({
      userId: existingUser.id,
      token: hashedToken,
      userAgent: userAgent,
      ipAddress: ipAddress,
      lastSeen: new Date(),
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    });

    const data = exclude(existingUser.dataValues, ["password"]);
    data.token = token;

    return apiResponse(res, 200, true, "User login successfully!", data);
  }
  // Process 2: Sign Up with Email & Password
  else {
    result.password = await bcrypt.hash(result.password, 10);
    result.role = ROLE.USER;
    result.dialCode = result?.phone ? "+880" : null;
    result.phone = result?.phone ? result.phone.replace(/^0+/, "") : null;

    const newUser = await User.create(result);
    const otp = String(getRandomInteger(100000, 999999));
    const token = generateSignature(
      {
        id: newUser.id,
        role: newUser.role,
        otp: await bcrypt.hash(otp, 10),
        otpExp: Math.floor(Date.now() / 1000) + 2 * 60, // Add 2 Minutes from Current Time
      },
      15 * 60 // 15 minutes for OTP Verify & Resend OTP
    );

    // Process 3: Send OTP Mail
    sendVerificationEmail(newUser.email, otp);

    return apiResponse(res, 201, true, "OTP send successfully!", { token });
  }
});

/**
 * Resend OTP on Registration
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userResendOtpOnReg = asyncHandler(async (req: IApiRequest, res: Response) => {
  // Validation 1: Time Limit Exceed
  if (req.otpExp > Math.floor(Date.now() / 1000)) {
    return apiResponse(res, 400, false, "Please, wait for 2 minutes before resend otp!");
  }

  // Validation 2: Real User ID
  const user = await User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } });
  if (!user) return apiResponse(res, 404, true, "User not found!");
  if (user.emailVerified) return apiResponse(res, 400, false, "This user already verified!");

  const otp = String(getRandomInteger(100000, 999999));
  const token = generateSignature(
    {
      id: user.id,
      role: user.role,
      otp: await bcrypt.hash(otp, 10),
      otpExp: Math.floor(Date.now() / 1000) + 2 * 60, // Add 2 Minutes from Current Time
    },
    15 * 60 // 15 minutes for OTP Verify & Resend OTP
  );

  // Process 1: Send OTP Mail
  sendVerificationEmail(user.email, otp);

  return apiResponse(res, 200, true, "OTP resend successfully!", { token });
});

/**
 * User OTP Verify & Login (User / Client)
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userRegOtpVerify = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { otp } = req.result;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  // Validation 1: OTP Expire
  if (req.otpExp < Math.floor(Date.now() / 1000)) return apiResponse(res, 400, false, "OTP Expired!");

  // Validation 2: OTP Check
  const isOtpValid = await bcrypt.compare(otp, req.otp);
  if (!isOtpValid) return apiResponse(res, 400, false, "Invalid OTP!");

  // Validation 3: Real User ID & Already Verified
  const user = await User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } });
  if (!user) return apiResponse(res, 404, true, "User not found!");
  if (user.emailVerified) return apiResponse(res, 400, false, "This user already verified!");

  // Process 1: Update User Info
  await User.update(
    {
      emailVerified: true,
      status: true,
    },
    { where: { id: req.id } }
  );

  // Process 2: Create Session
  const token = generateSignature({ id: user.id, role: user.role }, 30 * 24 * 60 * 60);
  const hashedToken = hashToken(token);

  const [data] = await Promise.all([
    User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } }),
    Session.create({
      userId: user.id,
      token: hashedToken,
      userAgent: userAgent,
      ipAddress: ipAddress,
      lastSeen: new Date(),
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    }),
  ]);

  return apiResponse(res, 200, true, "OTP verified & Login successfully!", data);
});

/**
 * User Login
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userLogin = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { email, password, provider } = req.result;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  // Validation 1: Correct Email
  const user = await User.findOne({ where: { email, emailVerified: true } });
  if (!user) return apiResponse(res, 401, false, "Please, complete your registration first!");

  // Validation 2: Apply Login with Change Provider
  if (user.provider !== provider) {
    const providerMessages: { [key: string]: string } = {
      google: "Your account was registered using Google. Please log in with Google!",
      default: "Please log in using the email and password you registered with!",
    };
    return apiResponse(res, 401, false, providerMessages[user.provider] || providerMessages.default);
  }

  // Validation 3: Check Password
  if (provider === "email") {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return apiResponse(res, 401, false, "Incorrect Password!");
  }

  // Process 1: Create Session
  const token = generateSignature({ id: user.id, role: user.role }, 30 * 24 * 60 * 60);
  const hashedToken = hashToken(token);

  await Session.create({
    userId: user.id,
    token: hashedToken,
    userAgent: userAgent,
    ipAddress: ipAddress,
    lastSeen: new Date(),
    expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
  });

  const data = exclude(user.dataValues, ["password"]);
  data.token = token;

  return apiResponse(res, 200, true, "Login successfully!", data);
});

/**
 * User Profile
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userProfile = asyncHandler(async (req: IApiRequest, res: Response) => {
  const data = await User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } });
  if (!data) return apiResponse(res, 404, true, "User not found!");

  if (data.image) data.image = `${process.env.IMAGE_BASE_URL}/${data.image}`;

  return apiResponse(res, 200, true, "User profile fetched successfully!", data);
});

/**
 * Update User Profile
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const updateUserProfile = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { softDeleted, ...updatedBody } = req.result;

  // File Validation
  if (req.hasFile) {
    const result: ICloudinaryResult = await req?.fileObject;
    if (result.status) updatedBody.image = result?.public_id;

    const prevImage = await User.findByPk(req.id, { attributes: ["image"] });
    if (result?.status && prevImage?.image) deleteImageFromCloudinary(prevImage?.image);
  }

  if (updatedBody?.phone) updatedBody.phone = updatedBody?.phone.replace(/^0+/, "");

  const data = await User.update(updatedBody, { where: { id: req.id } });
  if (!data[0]) return apiResponse(res, 404, false, "Admin not found!");

  return apiResponse(res, 200, true, "User profile updated successfully!");
});

/**
 * User Forget Password Request
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const sendForgetPasswordMail = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { email } = req.result;

  // Validation 1: Valid User
  const user = await User.findOne({ where: { email, emailVerified: true } });
  if (!user) return apiResponse(res, 401, false, "Please, complete your registration first!");

  const otp = String(getRandomInteger(100000, 999999));
  const token = generateSignature(
    {
      id: user.id,
      role: user.role,
      otp: await bcrypt.hash(otp, 10),
      otpExp: Math.floor(Date.now() / 1000) + 2 * 60, // Add 2 Minutes from Current Time
    },
    15 * 60 // 15 minutes for OTP Verify & Resend OTP
  );

  // Process 1: Send OTP Mail
  sendVerificationEmail(user.email, otp);

  return apiResponse(res, 200, true, "OTP send successfully!", { token });
});

/**
 * User Forget Password Resend OTP
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */

export const userForgetPasswordResendOtp = asyncHandler(async (req: IApiRequest, res: Response) => {
  // Validation 1: Time Limit Exceed
  if (req.otpExp > Math.floor(Date.now() / 1000)) {
    return apiResponse(res, 400, false, "Please, wait for 2 minutes before resend otp!");
  }

  // Validation 2: Real User ID
  const user = await User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } });
  if (!user) return apiResponse(res, 404, true, "User not found!");

  const otp = String(getRandomInteger(100000, 999999));
  const token = generateSignature(
    {
      id: user.id,
      role: user.role,
      otp: await bcrypt.hash(otp, 10),
      otpExp: Math.floor(Date.now() / 1000) + 2 * 60, // Add 2 Minutes from Current Time
    },
    15 * 60 // 15 minutes for OTP Verify & Resend OTP
  );

  // Process 1: Send OTP Mail
  sendVerificationEmail(user.email, otp);

  return apiResponse(res, 200, true, "OTP resend successfully!", { token });
});

/**
 * User Forget Password OTP Verify
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const userForgetPasswordOtpVerify = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { otp } = req.result;
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  // Validation 1: OTP Expire
  if (req.otpExp < Math.floor(Date.now() / 1000)) return apiResponse(res, 400, false, "OTP Expired!");

  // Validation 2: OTP Check
  const isOtpValid = await bcrypt.compare(otp, req.otp);
  if (!isOtpValid) return apiResponse(res, 400, false, "Invalid OTP!");

  const user = await User.findOne({ where: { id: req.id }, attributes: { exclude: ["password"] } });
  if (!user) return apiResponse(res, 404, true, "User not found!");

  // Process 1: Create Session
  const token = generateSignature({ id: user.id, role: user.role }, 15 * 60 * 60);
  const hashedToken = hashToken(token);

  await Session.create({
    userId: user.id,
    token: hashedToken,
    userAgent: userAgent,
    ipAddress: ipAddress,
    lastSeen: new Date(),
    expireAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min expiry
  });

  return apiResponse(res, 200, true, "OTP verified successfully!", { token });
});

/**
 * User Changed Forget Password
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const changeForgetPassword = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { password } = req.result;

  const user = await User.findOne({ where: { id: req.id } });
  if (!user) return apiResponse(res, 404, true, "User not found!");

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) return apiResponse(res, 400, false, "New password cannot be same as old password!");

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.update({ password: hashedPassword }, { where: { id: req.id } });

  return apiResponse(res, 200, true, "Password changed successfully!");
});

/**
 * Change Password
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const changePassword = asyncHandler(async (req: IApiRequest, res: Response) => {
  const { oldPassword, newPassword } = req.result;

  const user = await User.findOne({ where: { id: req.id } });
  if (!user) return apiResponse(res, 404, true, "User not found!");

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) throw "Old password is incorrect!";

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) throw "New password cannot be same as old password!";

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashedPassword }, { where: { id: req.id } });

  return apiResponse(res, 200, true, "Password changed successfully!");
});
