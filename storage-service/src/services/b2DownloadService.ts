import fetch from "node-fetch";
import b2AuthServiceInstance from "./b2AuthService";

const DOWNLOAD_URL_VALID_DURATION_IN_SECONDS = 3600 * 2; // 2 hours

interface DownloadAuthResponse {
  authorizationToken: string;
}

class B2DownloadService {
  private cachedDownloadAuthToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  private downloadAuthPromise: Promise<{
    downloadAuthToken: string | null;
  }> | null = null;

  private getDownloadAuthToken = async (): Promise<{
    downloadAuthToken: string | null;
  }> => {
    const currentTime = Date.now();

    if (
      this.cachedDownloadAuthToken &&
      this.tokenExpiryTime &&
      currentTime < this.tokenExpiryTime - 40 * 60 * 1000 // 40 minutes
    ) {
      return Promise.resolve({
        downloadAuthToken: this.cachedDownloadAuthToken,
      });
    } else {
      // If the token is expired or about to expire in 40 minutes, fetch a new one
      // Front end will refresh the queries after 30 minutes
      if (this.downloadAuthPromise) {
        return this.downloadAuthPromise;
      }

      this.downloadAuthPromise = (async () => {
        const auth = await b2AuthServiceInstance.authorizeAccount();
        console.log(
          "$$$$$$$$$$$$$$ fetch b2_get_download_authorization token:"
        );

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
              fileNamePrefix: "",
              validDurationInSeconds: DOWNLOAD_URL_VALID_DURATION_IN_SECONDS,
            }),
          }
        );

        const downloadAuth = (await response.json()) as DownloadAuthResponse;

        this.cachedDownloadAuthToken = downloadAuth.authorizationToken;
        this.tokenExpiryTime =
          currentTime + DOWNLOAD_URL_VALID_DURATION_IN_SECONDS * 1000;

        this.downloadAuthPromise = null;

        return { downloadAuthToken: this.cachedDownloadAuthToken };
      })();
      return this.downloadAuthPromise;
    }
  };

  public getDownloadUrl = async (fileName: string): Promise<string> => {
    const downloadAuth = await this.getDownloadAuthToken();
    const auth = await b2AuthServiceInstance.authorizeAccount();

    return `${auth.apiInfo.storageApi.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${downloadAuth.downloadAuthToken}`;
  };
}

const b2DownloadServiceInstance = new B2DownloadService();

export default b2DownloadServiceInstance;
