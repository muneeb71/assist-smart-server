import { Storage } from "@google-cloud/storage";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// You can set these in your .env or hardcode for local dev
const GCLOUD_PROJECT_ID = process.env.GCLOUD_PROJECT_ID;
const GCLOUD_BUCKET = process.env.GCLOUD_BUCKET;
const GCLOUD_KEYFILE = process.env.GCLOUD_KEYFILE; // path to your service account key

const storage = new Storage({
  projectId: GCLOUD_PROJECT_ID,
  keyFilename: GCLOUD_KEYFILE,
});

const bucket = storage.bucket(GCLOUD_BUCKET);

export async function uploadFileToGCP(
  fileBuffer,
  originalName,
  folder = "uploads"
) {
  const ext = path.extname(originalName);
  const gcpFileName = `${folder}/${uuidv4()}${ext}`;
  const file = bucket.file(gcpFileName);

  await file.save(fileBuffer, {
    resumable: false,
    contentType: "auto",
    public: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  // Return the public URL
  return `https://storage.googleapis.com/${GCLOUD_BUCKET}/${gcpFileName}`;
}
