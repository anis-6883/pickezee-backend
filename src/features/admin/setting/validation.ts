import Joi from "joi";
import { numberField, stringField } from "../../../helpers";

export const settingSchema = Joi.object({
  general: Joi.object({
    companyName: stringField("companyName"),
    dialCode: stringField("dialCode"),
    phone: stringField("phone"),
    country: stringField("country"),
    city: stringField("city"),
    province: stringField("province"),
    postalCode: stringField("postalCode"),
    address: stringField("address"),
    contactEmail: stringField("contactEmail"),
    contactPhone: stringField("contactPhone"),
    androidDownloadLink: stringField("androidDownloadLink"),
    iosDownloadLink: stringField("iosDownloadLink"),
    facebook: stringField("iosDownloadLink"),
    instagram: stringField("iosDownloadLink"),
    tiktok: stringField("iosDownloadLink"),
    linkedin: stringField("iosDownloadLink"),
    timezoneLabel: stringField("timezoneLabel"),
    timezoneValue: stringField("timezoneValue"),
  }).messages({
    "object.base": "general must be an object!",
  }),
  mail: Joi.object({
    host: stringField("host"),
    port: stringField("port"),
    username: stringField("username"),
    password: stringField("password"),
  }).messages({
    "object.base": "mail must be an object!",
  }),
  notification: Joi.object({
    notificationType: stringField("notificationType"),
    firebaseServerKey: stringField("firebaseServerKey"),
    firebaseTopics: stringField("firebaseTopics"),
    oneSignalAppId: stringField("oneSignalAppId"),
    oneSignalApiKey: stringField("oneSignalApiKey"),
  }).messages({
    "object.base": "notification must be an object!",
  }),
  page: Joi.object({
    terms: stringField("terms"),
    policy: stringField("policy"),
    aboutUs: stringField("aboutUs"),
  }).messages({
    "object.base": "page must be an object!",
  }),
  s3Bucket: Joi.object({
    awsRegion: stringField("awsRegion"),
    awsAccessKeyId: stringField("awsAccessKeyId"),
    awsSecretAccessKey: stringField("awsSecretAccessKey"),
    awsBucketName: stringField("awsBucketName"),
  }).messages({
    "object.base": "s3Bucket must be an object!",
  }),
  stripe: Joi.object({
    stripeSecretKey: stringField("stripeSecretKey"),
    stripeWebhookSecretKey: stringField("stripeWebhookSecretKey"),
    planChangeCost: numberField("planChangeCost"),
    refundableThreshold: numberField("refundableThreshold"),
    taxTitle: stringField("taxTitle"),
    taxCost: numberField("taxCost"),
    taxStatus: stringField("taxStatus"),
  }).messages({
    "object.base": "s3Bucket must be an object!",
  }),
  googleMap: Joi.object({
    googleMapsApiKey: stringField("googleMapsApiKey"),
  }).messages({
    "object.base": "googleMap must be an object!",
  }),
  twilio: Joi.object({
    sid: stringField("twilioAccountSID"),
    authToken: stringField("twilioAuthToken"),
  }).messages({
    "object.base": "twilio must be an object!",
  }),
});
