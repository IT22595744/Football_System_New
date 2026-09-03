const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const buildFileName = (originalName) => {
  const ext = path.extname(originalName || "");
  return `${Date.now()}-${crypto.randomUUID()}${ext}`;
};

const uploadBufferToS3 = async (file, folder = "teams/flags") => {
  if (!file || !file.buffer) {
    throw new Error("File buffer missing for S3 upload");
  }

  const key = `${folder}/${buildFileName(file.originalname)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  return { key, url };
};

const deleteFromS3Key = async (key) => {
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    })
  );
};

const extractKeyFromS3Url = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
};

module.exports = {
  uploadBufferToS3,
  deleteFromS3Key,
  extractKeyFromS3Url
};