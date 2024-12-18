import Joi from "joi";
import { requiredEmailField, requiredStringField, requiredWeakPasswordField } from "../../../helpers";

export const superAdminRegisterSchema = Joi.object({
  name: requiredStringField("name"),
  email: requiredEmailField,
  password: requiredWeakPasswordField(6),
});
