import b2DownloadServiceInstance from "./b2DownloadService";
import b2AuthServiceInstance, { AuthResponse } from "./b2AuthService";
import { B2UploadService } from "./b2UploadService";

interface File {
  filename: string;
  buffer: Buffer<ArrayBufferLike>;
  mimetype: string;
}

class B2Service {
  private uploadService: B2UploadService;

  constructor() {
    this.uploadService = new B2UploadService(this.getAuthInfo.bind(this));
  }

  public async getDownloadUrlForFile(fileName: string): Promise<string> {
    return b2DownloadServiceInstance.getDownloadUrl(fileName);
  }

  public async getAuthInfo(): Promise<AuthResponse> {
    return b2AuthServiceInstance.authorizeAccount();
  }

  public async uploadFile(file: File): Promise<void> {
    await this.uploadService.uploadFile(file);
  }
}

const b2ServiceInstance = new B2Service();

export default b2ServiceInstance;
