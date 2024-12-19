// const cloudinary = require("cloudinary").v2;
// const GeneralSettings = require("../models/settings/GeneralSetting");

// const extractPublicId = (url) => {
//   const parts = url.split("/");
//   const filenameExt = parts.pop(); // get the filename with extension
//   const filename = filenameExt.split(".").slice(0, -1).join("."); // Remove the file extension
//   const path = parts.slice(-2).join("/"); // Get the path excluding the domain

//   return `${path}/${filename}`;
// };

// /**
//  * Uploads an image to Cloudinary and returns the secure URL.
//  * @param {object} image - The image object (e.g. req.file ).
//  * @param {string} data - for upload: folder path; for update/delete: image url
//  * @param {string} operation - The operation to perform (upload, update, delete).
//  * @returns {Promise<string>} The secure URL of the uploaded image.
//  */

// async function uploadImage(image, data = "", operation = "upload") {
//   try {
//     const generalSettings = await GeneralSettings.findOne();

//     if (
//       generalSettings?.cloudinaryRootFolderName === "" ||
//       generalSettings?.cloudinaryApiKey === "" ||
//       generalSettings?.cloudinaryAppSecret === "" ||
//       generalSettings?.cloudinaryCloudName === ""
//     )
//       throw new Error("Update the Cloudinary config first!");

//     cloudinary.config({
//       cloud_name: generalSettings?.cloudinaryCloudName,
//       api_key: generalSettings?.cloudinaryApiKey,
//       api_secret: generalSettings?.cloudinaryAppSecret
//     });

//     const options =
//       operation === "upload" ? { folder: `${generalSettings?.cloudinaryRootFolderName}/${data}` } : { public_id: extractPublicId(data) };

//     if (operation === "delete") {
//       const deleted = await cloudinary.uploader.destroy(options.public_id);
//       return deleted;
//     } else {
//       if (!image) throw new Error("Please provide a file!"); // ensure image is provided

//       // const b64 = Buffer.from(image.buffer).toString("base64");
//       // let dataURI = "data:" + image.mimetype + ";base64," + b64;

//       const uploaded = await cloudinary.uploader.upload(image, options);
//       return uploaded?.secure_url || Promise.reject(new Error("Upload failed"));
//     }
//   } catch (error) {
//     const cloudinaryError = "Cloudinary: " + error.message;
//     throw new Error(cloudinaryError);
//   }
// }

// module.exports = uploadImage;
