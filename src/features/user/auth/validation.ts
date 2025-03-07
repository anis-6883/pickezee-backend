import Joi from "joi";
import { requiredEmailField, requiredStringField, requiredWeakPasswordField } from "../../../helpers";

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
