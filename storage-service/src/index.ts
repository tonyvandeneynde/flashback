import amqp from "amqplib/callback_api";
import fetch from "node-fetch";
import express from "express";
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

async function authorizeAccount() {
  const authResponse = await fetch(
    "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.B2_APPLICATION_KEY_ID +
              ":" +
              process.env.B2_APPLICATION_KEY
          ).toString("base64"),
      },
    }
  );
  const auth = await authResponse.json();
  return auth;
}

async function getUploadUrl(auth: any) {
  const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: auth.authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketId: process.env.B2_BUCKET_ID,
    }),
  });
  const uploadUrlData = await response.json();
  return uploadUrlData;
}

async function getDownloadUrl(auth: any, fileName: string) {
  const response = await fetch(
    `${auth.apiUrl}/b2api/v2/b2_get_download_authorization`,
    {
      method: "POST",
      headers: {
        Authorization: auth.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: process.env.B2_BUCKET_ID,
        fileNamePrefix: fileName,
        validDurationInSeconds: 3600, // Image URL valid for 1 hour
      }),
    }
  );
  const downloadAuth = (await response.json()) as any;
  const downloadUrl = `${auth.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${downloadAuth.authorizationToken}`;
  return downloadUrl;
}

async function uploadFile(uploadUrlData: any, file: any) {
  // Convert the buffer data back to a Buffer object
  const buffer = Buffer.from(file.buffer.data);

  const response = await fetch(uploadUrlData.uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadUrlData.authorizationToken,
      "X-Bz-File-Name": encodeURIComponent(file.filename),
      "Content-Type": file.mimetype,
      "X-Bz-Content-Sha1": "do_not_verify",
      "Content-Length": buffer.length.toString(),
    },
    body: buffer,
  });

  const uploadResponse = await response.json();
  return uploadResponse;
}

async function processMessage(msg: amqp.Message, ch: amqp.Channel) {
  if (!msg) return;

  const { uploadId, files } = JSON.parse(msg.content.toString()) as {
    uploadId: string;
    files: { filename: string; buffer: Buffer; mimetype: string }[];
  };

  try {
    const auth = await authorizeAccount();
    const uploadUrlData = await getUploadUrl(auth);

    for (const file of files) {
      try {
        const uploadResponse = await uploadFile(uploadUrlData, file);
        console.log(
          `File uploaded successfully: ${file.filename}`,
          uploadResponse
        );
      } catch (err) {
        console.error(`Error uploading file: ${file.filename}`, err);
      }
    }

    ch.ack(msg);
  } catch (err) {
    console.error("Error processing message:", err);
  }
}

// RabbitMQ connection
amqp.connect(process.env.RABBITMQ_URL || "", (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, ch) => {
    if (err) throw err;
    ch.assertQueue("image_uploads", { durable: true });

    ch.consume(
      "image_uploads",
      async (msg) => {
        if (!msg) return;
        await processMessage(msg, ch);
      },
      { noAck: false }
    );
  });
});

app.get("/download/:fileName", async (req, res) => {
  const fileName = req.params.fileName;
  console.log("fileName:", fileName);

  try {
    const auth = await authorizeAccount();
    const downloadUrl = await getDownloadUrl(auth, fileName);
    res.json({ downloadUrl });
  } catch (err) {
    console.error("Error getting download URL:", err);
    res.status(500).json({ error: "Failed to get download URL" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
