import { v2 as cloudinary } from "cloudinary";
import Setting, { ISetting } from "../models/setting";
import { ICloudinaryResult } from "./interfaces";

async function getCloudinaryInstance() {
  try {
    const cloudinaryMetadata: ISetting[] = await Setting.findAll({
      where: { group: "cloudinary" },
      attributes: ["name", "value"],
    });

    const settingsMap = cloudinaryMetadata.reduce(
      (acc, setting) => {
        acc[setting.name] = setting.value;
        return acc;
      },
      {} as Record<string, string>
    );

    const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryAppSecret, cloudinaryRootFolderName } = settingsMap;

    if (!(cloudinaryCloudName && cloudinaryApiKey && cloudinaryAppSecret && cloudinaryRootFolderName)) {
      throw new Error("Cloudinary settings are missing or incomplete!");
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudinaryCloudName,
      api_key: cloudinaryApiKey,
      api_secret: cloudinaryAppSecret,
    });

    return [cloudinary, cloudinaryRootFolderName] as const;
  } catch (err: any) {
    console.log("Error: ", err);
  }
}

// Upload stream image into Cloudinary
export async function uploadStreamImageIntoCloudinary(buffer: Buffer, folderName: string): Promise<ICloudinaryResult> {
  try {
    const [cloudinary, cloudinaryRootFolderName] = await getCloudinaryInstance();
    const location = `${cloudinaryRootFolderName}/${folderName}`;

    const result: ICloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder: location }, (error, result) => {
          if (error) {
            console.log("Error: ", error);
            reject({
              status: false,
              message: "Image upload failed!",
              public_id: null,
            });
          } else {
            resolve({
              status: true,
              message: "Image uploaded successfully!",
              public_id: result.public_id,
            });
          }
        })
        .end(buffer);
    });

    return result;
  } catch (error) {
    console.log("Error: ", error);
    return {
      status: false,
      message: "Image upload failed!",
      public_id: null,
    };
  }
}

// Upload image into Cloudinary
export async function uploadImageIntoCloudinary(
  file: Express.Multer.File,
  folderName: string
): Promise<ICloudinaryResult> {
  try {
    const [cloudinary, cloudinaryRootFolderName] = await getCloudinaryInstance();
    const location = `${cloudinaryRootFolderName}/${folderName}`;

    const b64 = Buffer.from(file.buffer).toString("base64");
    let dataURI = "data:" + file.mimetype + ";base64," + b64;

    const res = await cloudinary.uploader.upload(dataURI, {
      resource_type: "image",
      folder: location,
    });

    return {
      status: true,
      message: "Image uploaded successfully!",
      public_id: res.public_id,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      status: false,
      message: "Image upload failed!",
      public_id: null,
    };
  }
}

// Delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const [cloudinary] = await getCloudinaryInstance();

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.log("Error: ", error);
          reject({
            status: false,
            message: "Image deletion failed!",
          });
        } else {
          resolve({
            status: true,
            message: "Image deleted successfully!",
          });
        }
      });
    });

    return result;
  } catch (error) {
    console.log("Error: ", error);
  }
}
