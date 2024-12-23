import { Response } from "express";
import { IApiRequest } from "../../../configs/interfaces";
import { apiResponse, asyncHandler } from "../../../helpers/index";

/**
 * Store Setting Info
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const storeSettingInfo = asyncHandler(async (req: IApiRequest, res: Response) => {
  return apiResponse(res, 200, true, "Setting info stored successfully!");
});
