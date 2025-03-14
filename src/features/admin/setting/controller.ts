import { Response } from "express";
import { GroupedSettings, IApiRequest } from "../../../configs/interfaces";
import { apiResponse, asyncHandler } from "../../../helpers/index";
import Setting from "../../../models/setting";
import { settingSchema } from "./validation";

/**
 * Update Setting Info
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const updateSettingInfo = asyncHandler(async (req: IApiRequest, res: Response) => {
  const result = await settingSchema.validateAsync(req.body);

  // Prepare an array for new settings
  const newSettings = [];

  // Iterate over the groups in the result object
  for (const [group, settings] of Object.entries(result)) {
    for (const [name, value] of Object.entries(settings)) {
      const existingSetting = await Setting.findOne({
        where: { group, name },
      });

      if (existingSetting) await existingSetting.update({ value });
      else newSettings.push({ group, name, value });
    }
  }

  // Bulk create new settings (if there are any)
  if (newSettings.length > 0) await Setting.bulkCreate(newSettings);

  return apiResponse(res, 200, true, "Setting info has been updated successfully!");
});

/**
 * Get Setting Info
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const getSettingsInfo = asyncHandler(async (req: IApiRequest, res: Response) => {
  const settings = await Setting.findAll();

  const groupedSettings: GroupedSettings = settings.reduce((acc: GroupedSettings, setting) => {
    const { group, name, value } = setting;

    if (!acc[group]) acc[group] = {};

    acc[group][name] = value;

    return acc;
  }, {});

  return apiResponse(res, 200, true, "Settings data fetched successfully!", groupedSettings);
});
