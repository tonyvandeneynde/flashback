import axios, { AxiosError } from "axios";
import fetch from "node-fetch";
import { AxiosProgressEvent } from "axios";

type ApiInfo = {
  storageApi: {
    absoluteMinimumPartSize: number;
    apiUrl: string;
    bucketId: string;
    bucketName: string;
    capabilities: string[];
    downloadUrl: string;
    infoType: string;
    namePrefix: string | null;
    recommendedPartSize: number;
    s3ApiUrl: string;
  };
};

type AuthResponse = {
  accountId: string;
  apiInfo: ApiInfo;
  applicationKeyExpirationTimestamp: string | null;
  authorizationToken: string;
};

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

interface DownloadAuthResponse {
  authorizationToken: string;
}
// TODO: Refactor
class B2Service {
  private cachedDownloadAuthToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  private cachedAuth: AuthResponse | null = null;
  private authExpiryTime: number | null = null;
  private authPromise: Promise<AuthResponse> | null = null;

  private downloadAuthPromise: Promise<{ downloadAuthToken: string }> | null =
    null;

  private authorizeAccount = async (): Promise<AuthResponse> => {
    const currentTime = Date.now();

    // Check if the cached token is still valid
    if (
      this.cachedAuth &&
      this.authExpiryTime &&
      currentTime < this.authExpiryTime
    ) {
      return this.cachedAuth;
    }

    // If there's an ongoing authorization request, return its promise
    if (this.authPromise) {
      return this.authPromise;
    }

    // Create a new authorization request
    this.authPromise = (async () => {
      console.log("$$$$$$$$$$$$$$ fetch b2_authorize_account:");

      const authorizeCall = () => {
        return fetch(
          "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
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
      };

      const authResponse = await this.callB2WithBackOff(authorizeCall);

      if (authResponse.status !== 200) {
        throw new Error("Failed to authorize B2 account");
      }

      const auth = (await authResponse.json()) as AuthResponse;

      // Cache the new token and set the expiry time
      this.cachedAuth = auth;
      this.authExpiryTime = currentTime + 3600 * 1000 * 24; // Auth token is valid for 24 hours

      // Clear the authPromise after it resolves
      this.authPromise = null;

      return auth;
    })();

    return this.authPromise;
  };

  private getDownloadAuth = async (): Promise<{
    downloadAuthToken: string;
  }> => {
    const currentTime = Date.now();

    if (
      this.cachedDownloadAuthToken &&
      this.tokenExpiryTime &&
      currentTime < this.tokenExpiryTime
    ) {
      return Promise.resolve({
        downloadAuthToken: this.cachedDownloadAuthToken,
      });
    } else {
      if (this.downloadAuthPromise) {
        return this.downloadAuthPromise;
      }

      this.downloadAuthPromise = (async () => {
        const auth = await this.authorizeAccount();
        console.log("$$$$$$$$$$$$$$ fetch b2_get_download_authorization:");

        const response = await fetch(
          `${auth.apiInfo.storageApi.apiUrl}/b2api/v3/b2_get_download_authorization`,
          {
            method: "POST",
            headers: {
              Authorization: auth.authorizationToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bucketId: process.env.B2_BUCKET_ID,
              fileNamePrefix: "", // process.env.B2_BUCKET_NAME,
              validDurationInSeconds: 3600 * 2, // Image URL valid for 2 hours
            }),
          }
        );

        const downloadAuth = (await response.json()) as DownloadAuthResponse;

        this.cachedDownloadAuthToken = downloadAuth.authorizationToken;
        this.tokenExpiryTime = currentTime + 3600 * 2000; // 2 hours

        this.downloadAuthPromise = null;

        return { downloadAuthToken: this.cachedDownloadAuthToken };
      })();
      return this.downloadAuthPromise;
    }
  };

  private getDownloadUrl = async (fileName: string): Promise<string> => {
    const downloadAuth = await this.getDownloadAuth();
    const auth = await this.authorizeAccount();

    return `${auth.apiInfo.storageApi.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${downloadAuth.downloadAuthToken}`;
  };

  public async getDownloadUrlForFile(fileName: string): Promise<string> {
    return this.getDownloadUrl(fileName);
  }

  /**************************************************************************
   ** UPLOAD FILES
   ***************************************************************************/

  private makeGetUploadUrlRequest =
    async (): Promise<UrlAndAuthTokenResponse> => {
      try {
        const auth = await this.authorizeAccount();
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

  private callB2WithBackOff = async <T>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    let delaySeconds = 1;
    const maxDelay = 64;
    while (true) {
      const response = await requestFn();
      const status = (response as any).status;
      const statusCode = (response as any).statusCode;
      console.log("&&&&&&&&&&&&&&& status callB2Backoff:", status);
      if (status === 429 || status === 503 || statusCode === "ECONNRESET") {
        if (delaySeconds > maxDelay) {
          return response;
        }
        await this.sleepSeconds(delaySeconds);
        delaySeconds *= 2;
      } else {
        return response;
      }
    }
  };

  private sleepSeconds = (seconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  };

  private exponentialBackOff = async (retryCount: number): Promise<void> => {
    const waitTime = Math.pow(2, retryCount);
    await this.sleepSeconds(waitTime);
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
        const getUrlResponse =
          await this.callB2WithBackOff<UrlAndAuthTokenResponse>(
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
        await this.exponentialBackOff(i);
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
}

const b2ServiceInstance = new B2Service();

export default b2ServiceInstance;
