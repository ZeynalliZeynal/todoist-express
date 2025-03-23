import { generateName } from "../utils/generate-name";
import {
  DeleteObjectCommand,
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
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_key,
  },
  region: s3_bucket_region,
});

export const uploadFileService = async ({
  buffer,
  contentType,
  existingFilename,
}: {
  buffer?: Buffer;
  contentType?: string;
  existingFilename?: string;
}) => {
  if (existingFilename) {
    await deleteFileService({
      filename: existingFilename,
    });
  }

  const filename = generateName();
  const putCommand = new PutObjectCommand({
    Bucket: s3_bucket_name,
    Key: `avatars/${filename}`,
    Body: buffer,
    ContentType: contentType,
  });

  const getCommand = new GetObjectCommand({
    Bucket: s3_bucket_name,
    Key: `avatars/${filename}`,
  });

  const fileUrl = await getSignedUrl(s3, getCommand);

  await s3.send(putCommand);
  return fileUrl;
};

export const deleteFileService = async ({ filename }: { filename: string }) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: s3_bucket_name,
    Key: `avatars/${filename}`,
  });

  await s3.send(deleteCommand);
};
