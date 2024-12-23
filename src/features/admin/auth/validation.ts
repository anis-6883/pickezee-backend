import Joi from "joi";
import {
  emailField,
  requiredEmailField,
  requiredStringField,
  requiredWeakPasswordField,
  stringField,
} from "../../../helpers";

export const adminRegisterSchema = Joi.object({
  name: requiredStringField("name"),
  email: requiredEmailField,
  password: requiredWeakPasswordField(6),
});

export const loginSchema = Joi.object({
  email: requiredEmailField,
  password: requiredStringField("password"),
});

export const updateAdminSchema = Joi.object({
  email: emailField,
  name: stringField("name"),
});

export const adminChangePasswordSchema = Joi.object({
  oldPassword: requiredStringField("oldPassword"),
  newPassword: Joi.string().required().min(6).messages({
    "any.required": "newPassword is required!",
    "string.base": "newPassword must be string!",
    "string.min": "newPassword must be 8 characters long!",
  }),
  confirmPassword: Joi.any().equal(Joi.ref("newPassword")).required().messages({
    "any.only": "passwords do not match!",
    "any.required": "confirmPassword is required!",
  }),
});
