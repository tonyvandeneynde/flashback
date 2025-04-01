import axios from "axios";
import b2DownloadServiceInstance from "./b2DownloadService";
import b2AuthServiceInstance, { AuthResponse } from "./b2AuthService";
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

// TODO: Refactor
class B2Service {
  /**************************************************************************
   ** UPLOAD FILES
   ***************************************************************************/

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
        if (
          error.response &&
          (error.response.status === 500 ||
            error.response.status === 503 ||
            error.response.status === 429 ||
            error.response.status === 408 ||
            error.response.status === 401 ||
            error.response.data.code === "ECONNRESET")
        ) {
          console.log("error.response.status:", error.response.status);
          console.log("error.response.data:", error.response.data);

          return {
            response: error.response.data,
            status: error.response.status,
            statusCode: error.response.data.code,
          };
        }
        throw error;
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
      if (
        error.response &&
        (error.response.status === 500 ||
          error.response.status === 503 ||
          error.response.status === 429 ||
          error.response.status === 408 ||
          error.response.status === 401 ||
          error.response.data.code === "ECONNRESET")
      ) {
        console.log("error.response.status:", error.response.status);
        console.log("error.response.data:", error.response.data);

        return {
          status: error.response.status,
          statusCode: error.response.data.code,
        };
      }
      throw error;
    }
  };

  private reportFailure(uploadInfo: File, response: any): void {
    console.error(`Failed to upload ${uploadInfo.filename}:`, response);
  }

  private reportSuccess(uploadInfo: File): void {
    console.log(`Successfully uploaded ${uploadInfo.filename}`);
  }

  public uploadFile = async (file: File): Promise<void> => {
    console.log("############################ uploadFile:", file.filename);
    const uploadInfo: File = file;
    let succeeded = false;

    let urlAndAuthToken: UrlAndAuthToken | null = null;

    for (let i = 0; i < 8 && !succeeded; i++) {
      if (urlAndAuthToken === null) {
        const getUrlResponse = await callB2WithBackOff<UrlAndAuthTokenResponse>(
          this.makeGetUploadUrlRequest
        );

        const status = getUrlResponse.status;
        console.log("%%%%%%%%%%%% status:", status);
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
      console.log("&&&&&&&&&&&&&&& status uploadFile:", status);
      console.log(
        "&&&&&&&&&&&&&&& response.statusCode uploadFile:",
        response.statusCode
      );

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

    console.log(
      "%%%%%%%%%%%%%%%%%%%%%% Successfully uploaded file ",
      uploadInfo.filename
    );
  };

  public async getDownloadUrlForFile(fileName: string): Promise<string> {
    return b2DownloadServiceInstance.getDownloadUrl(fileName);
  }

  public async getAuthInfo(): Promise<AuthResponse> {
    return b2AuthServiceInstance.authorizeAccount();
  }
}

const b2ServiceInstance = new B2Service();

export default b2ServiceInstance;
