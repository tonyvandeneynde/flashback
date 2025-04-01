import fetch from "node-fetch";
import b2AuthServiceInstance from "./b2AuthService";

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
              validDurationInSeconds: 3600 * 2,
            }),
          }
        );

        const downloadAuth = (await response.json()) as DownloadAuthResponse;

        this.cachedDownloadAuthToken = downloadAuth.authorizationToken;
        this.tokenExpiryTime = currentTime + 3600 * 2000;

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
