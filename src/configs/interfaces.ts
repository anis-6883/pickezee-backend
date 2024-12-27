import { Request } from "express";

export interface IConfig {
  [key: string]: {
    corsOptions: {
      origin: string[];
      credentials: boolean;
    };
    databaseURI: string;
    port: number | string;
    apiKey: string;
    appSecret: string;
    cookieName: string;
  };
}

export interface IUser {
  id: string;
  image: string;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  dialCode: string;
  phone: string;
  phoneVerified: boolean;
  provider: "email" | "phone" | "google" | "facebook";
  status: boolean;
  role: "user" | "admin";
  gender: "male" | "female" | "others" | "";
  dob: string;
  token: string;
}

export interface IApiRequest extends Request {
  user?: IUser;
  otp?: string;
  token?: string;
  role: string;
}

export type IJWTQuery = { email: string; token?: string };

export interface GroupedSettings {
  [group: string]: {
    [name: string]: string;
  };
}

export interface ICloudinaryResult {
  status: boolean;
  message: string;
  public_id?: string | null;
}
