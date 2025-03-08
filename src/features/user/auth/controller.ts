import bcrypt from "bcrypt";
import { Response } from "express";
import { ROLE } from "../../../configs/constants";
import { IApiRequest } from "../../../configs/interfaces";
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

  if (existingUser && existingUser.emailVerified && result.provider === "email") {
    return apiResponse(res, 409, false, "Please log in using the email and password you registered with!");
  }

  // Delete Un-verified Account
  if (existingUser && !existingUser.emailVerified && result.provider === "email") {
    await User.destroy({
      where: { id: existingUser.id },
    });
  }

  if (existingUser && existingUser.emailVerified && result.provider !== existingUser.provider) {
    const providerMessages: Record<string, string> = {
      google: "Your account was registered using Google. Please log in with Google!",
      default: "Please log in using the email and password you registered with!",
    };

    const message = providerMessages[existingUser.provider] || providerMessages["default"];
    return apiResponse(res, 401, false, message);
  }

  if (result.provider !== "email") {
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

    // Active Session Limit is 3
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
  } else {
    result.password = await bcrypt.hash(result.password, 10);
    result.role = ROLE.USER;
    result.dialCode = result?.phone ? "+880" : null;
    result.phone = result?.phone ? result.phone.replace(/^0+/, "") : null;

    const newUser = await User.create(result);
    const otp = String(getRandomInteger(100000, 999999));
    const token = generateSignature(
      { id: newUser.id, role: newUser.role, otp: await bcrypt.hash(otp, 10) },
      2 * 60 * 60
    );

    // Send OTP Mail
    sendVerificationEmail(newUser.email, otp);

    return apiResponse(res, 201, true, "OTP send successfully!", { token });
  }
});
