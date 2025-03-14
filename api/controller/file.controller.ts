import catchErrors from "../utils/catch-errors";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  s3_access_key,
  s3_bucket_name,
  s3_bucket_region,
  s3_secret_key,
} from "../constants/env";
import { StatusCodes } from "http-status-codes";
import { generateName } from "../utils/generate-name";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_key,
  },
  region: s3_bucket_region,
});

export const uploadFile = catchErrors(async (req, res, next) => {
  // const filename = req.file?.originalname.split(" ").join("_");

  const filename = generateName();
  const putCommand = new PutObjectCommand({
    Bucket: s3_bucket_name,
    Key: `avatars/${filename}`,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  });

  const getCommand = new GetObjectCommand({
    Bucket: s3_bucket_name,
    Key: `avatars/${filename}`,
  });

  const fileUrl = await getSignedUrl(s3, getCommand);

  await s3.send(putCommand);

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "File uploaded successfully",
    data: {
      fileUrl: fileUrl,
    },
  });
});
