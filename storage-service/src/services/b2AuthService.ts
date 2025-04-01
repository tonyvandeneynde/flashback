import fetch from "node-fetch";
import { callB2WithBackOff } from "../utils";

export type AuthResponse = {
  accountId: string;
  apiInfo: {
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
  applicationKeyExpirationTimestamp: string | null;
  authorizationToken: string;
};

class B2AuthService {
  private cachedAuth: AuthResponse | null = null;
  private authExpiryTime: number | null = null;
  private authPromise: Promise<AuthResponse> | null = null;

  public authorizeAccount = async (): Promise<AuthResponse> => {
    const currentTime = Date.now();

    if (
      this.cachedAuth &&
      this.authExpiryTime &&
      currentTime < this.authExpiryTime
    ) {
      return this.cachedAuth;
    }

    if (this.authPromise) {
      return this.authPromise;
    }

    this.authPromise = (async () => {
      console.log("Authorizing B2 account");

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

      const authResponse = await callB2WithBackOff(authorizeCall);

      if (authResponse.status !== 200) {
        throw new Error("Failed to authorize B2 account");
      }

      const auth = (await authResponse.json()) as AuthResponse;

      this.cachedAuth = auth;
      this.authExpiryTime = currentTime + 3600 * 1000 * 24;

      this.authPromise = null;

      return auth;
    })();

    return this.authPromise;
  };
}

const b2AuthServiceInstance = new B2AuthService();

export default b2AuthServiceInstance;
