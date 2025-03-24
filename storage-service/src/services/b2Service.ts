import fetch from "node-fetch";

interface AuthResponse {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
}

export async function authorizeAccount(): Promise<AuthResponse> {
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
  return auth as AuthResponse;
}

export async function getUploadUrl(auth: AuthResponse) {
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
  const uploadUrlData = (await response.json()) as any;
  return uploadUrlData;
}

export async function getDownloadUrl(auth: AuthResponse, fileName: string) {
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
  const downloadAuth = (await response.json()) as {
    authorizationToken: string;
  };
  const downloadUrl = `${auth.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${downloadAuth.authorizationToken}`;
  return downloadUrl;
}

export async function uploadFile(
  uploadUrlData: { uploadUrl: string; authorizationToken: string },
  file: { filename: string; buffer: { data: string }; mimetype: string }
) {
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
