import Joi from "joi";
import {
  emailField,
  requiredEmailField,
  requiredStringField,
  requiredWeakPasswordField,
  stringField,
} from "../../../helpers";

export const userRegisterSchema = Joi.object({
  provider: requiredStringField("provider").lowercase().valid("email", "google").messages({
    "any.only": "provider must be [email, google]",
  }),
  name: requiredStringField("name"),
  phone: Joi.string().when("provider", {
    is: "email",
    then: requiredStringField("phone")
      .length(11)
      .pattern(/^01\d{9}$/)
      .messages({
        "string.length": "Phone number must be exactly 11 characters long!",
        "string.pattern.base": "Phone number must start with '01'!",
      }),
    otherwise: Joi.optional(),
  }),
  email: requiredEmailField,
  password: Joi.string().when("provider", {
    is: "email",
    then: requiredWeakPasswordField(6),
    otherwise: Joi.optional(),
  }),
});

export const verifyOtpSchema = Joi.object({
  otp: requiredStringField("otp").min(6).max(6).messages({
    "string.min": "otp must be 6 digits long!",
    "string.max": "otp must be 6 digits long!",
  }),
});

export const userLoginSchema = Joi.object({
  provider: requiredStringField("provider").lowercase().valid("email", "google").messages({
    "any.only": "provider must be [email, google]",
  }),
  email: Joi.string().when("provider", {
    is: ["email", "google"],
    then: requiredEmailField,
    otherwise: emailField,
  }),
  password: Joi.string().when("provider", {
    is: "email",
    then: requiredWeakPasswordField(6),
    otherwise: stringField("password"),
  }),
});

export const updateProfileSchema = Joi.object({
  name: stringField("name"),
  phone: stringField("phone"),
  dob: stringField("dob"),
  gender: stringField("gender").valid("male", "female", "other").messages({
    "any.only": "gender must be [male, female, other]",
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: requiredEmailField,
});

export const changeForgetPasswordSchema = Joi.object({
  password: requiredWeakPasswordField(6),
  confirmPassword: Joi.any().equal(Joi.ref("password")).required().messages({
    "any.only": "passwords do not match!",
    "any.required": "confirmPassword is required!",
  }),
});

export const changePasswordSchema = Joi.object({
  oldPassword: requiredStringField("oldPassword"),
  newPassword: requiredStringField("newPassword").min(6).messages({
    "string.min": "newPassword must be 6 characters long!",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("newPassword")).required().messages({
    "any.only": "passwords do not match!",
    "any.required": "confirmPassword is required!",
  }),
});
