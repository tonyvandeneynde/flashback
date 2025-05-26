import { AuthResponse } from "./b2AuthService";
import axios from "axios";
import { callB2WithBackOff, exponentialBackOff } from "../utils";

interface File {
  filename: string;
  buffer: Buffer<ArrayBufferLike>;
  mimetype: string;
}

interface UrlAndAuthToken {
  uploadUrl: string;
  bucketId: string;
  authorizationToken: string;
}

interface UrlAndAuthTokenResponse {
  response: UrlAndAuthToken;
  status: number;
  statusCode?: string;
}

export class B2UploadService {
  constructor(private getAuthInfo: () => Promise<AuthResponse>) {}

  private handleError(
    error: any
  ): { status: number; statusCode?: string; response: any } | never {
    if (
      error.response &&
      (error.response.status === 500 ||
        error.response.status === 503 ||
        error.response.status === 429 ||
        error.response.status === 408 ||
        error.response.status === 401 ||
        error.response.data.code === "ECONNRESET")
    ) {
      return {
        response: error.response.data,
        status: error.response.status,
        statusCode: error.response.data.code,
      };
    }
    throw error; // Re-throw the error if it doesn't match the handled cases
  }

  private makeGetUploadUrlRequest =
    async (): Promise<UrlAndAuthTokenResponse> => {
      try {
        const auth = await this.getAuthInfo();
        const response = await axios.post(
          `${auth.apiInfo.storageApi.apiUrl}/b2api/v2/b2_get_upload_url`,
          {
            bucketId: process.env.B2_BUCKET_ID,
          },
          {
            headers: {
              Authorization: auth.authorizationToken,
              "Content-Type": "application/json",
            },
          }
        );

        const responseJson = response.data as UrlAndAuthToken;
        return { response: responseJson, status: response.status };
      } catch (error: any) {
        return this.handleError(error);
      }
    };

  private makeUploadRequest = async (
    uploadInfo: File,
    urlAndAuthToken: UrlAndAuthToken
  ): Promise<any> => {
    const { uploadUrl, authorizationToken } = urlAndAuthToken!;
    const config = {
      headers: {
        Authorization: authorizationToken,
        "X-Bz-File-Name": encodeURIComponent(uploadInfo.filename),
        "Content-Type": uploadInfo.mimetype,
        "X-Bz-Content-Sha1": "do_not_verify",
      },
    };

    try {
      return await axios.post(uploadUrl, uploadInfo.buffer, config);
    } catch (error: any) {
      return this.handleError(error);
    }
  };

  private reportFailure(uploadInfo: File, response: any): void {
    console.error(`Failed to upload ${uploadInfo.filename}:`, response);
  }

  private reportSuccess(uploadInfo: File): void {
    console.log(`Successfully uploaded ${uploadInfo.filename}`);
  }

  public uploadFile = async (file: File): Promise<void> => {
    const uploadInfo: File = file;
    let succeeded = false;

    let urlAndAuthToken: UrlAndAuthToken | null = null;

    for (let i = 0; i < 8 && !succeeded; i++) {
      if (urlAndAuthToken === null) {
        const getUrlResponse = await callB2WithBackOff<UrlAndAuthTokenResponse>(
          this.makeGetUploadUrlRequest
        );

        const status = getUrlResponse.status;
        if (status !== 200) {
          this.reportFailure(uploadInfo, getUrlResponse.response);
          return;
        }
        urlAndAuthToken = getUrlResponse.response;
      }

      const response = await this.makeUploadRequest(
        uploadInfo,
        urlAndAuthToken
      );
      const status = response.status;

      if (status === 200) {
        this.reportSuccess(uploadInfo);
        succeeded = true;
        break;
      } else if (response.isFailureToConnect || response.isBrokenPipe) {
        urlAndAuthToken = null;
      } else if (
        status === 401 &&
        (response.statusCode === "expired_auth_token" ||
          response.statusCode === "bad_auth_token")
      ) {
        urlAndAuthToken = null;
      } else if (status === 408 || status === 429 || status === 503) {
        await exponentialBackOff(i);
      } else {
        this.reportFailure(uploadInfo, response);
        return;
      }
    }

    urlAndAuthToken = null;

    if (!succeeded) {
      this.reportFailure(uploadInfo, "Failed to upload file");
      throw new Error(`Failed to upload file after retries`);
    }
  };
}
