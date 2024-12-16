import { Request } from "express";
import mongoose from "mongoose";

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
  _id: mongoose.Types.ObjectId;
  name: string;
  postalCode?: string;
  city: string;
  phone: string;
  dialCode: string;
  email: string;
  password: string;
  image: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
}

export interface IApiRequest extends Request {
  user?: IUser;
  otp?: string;
  token?: string;
  role: string;
}

export interface IJWTQuery {
  email: string;
  token?: string;
}
