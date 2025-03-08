import nodemailer from "nodemailer";
import { Op } from "sequelize";
import Setting, { ISetting } from "../../../models/setting";
import { otpTemplate } from "../../../templates/otp";

export const sendVerificationEmail = async (email: string, verificationCode: number | string) => {
  try {
    const settingData: ISetting[] = await Setting.findAll({
      where: {
        [Op.or]: [{ group: "mail" }, { group: "general" }],
      },
      attributes: ["name", "value"],
    });

    const settingsMap = settingData.reduce(
      (acc, setting) => {
        acc[setting.name] = setting.value;
        return acc;
      },
      {} as Record<string, string>
    );

    if (!settingsMap) throw "Something went wrong in email settings!";

    const { host, port, username, password, companyName, address } = settingsMap;

    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: true,
      auth: {
        user: username,
        pass: password,
      },
    });

    const template = otpTemplate(String(verificationCode), companyName ?? "", address ?? "");

    const mailOptions = {
      from: username,
      to: email,
      subject: "Email Verification",
      html: template,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email!");
  }
};
