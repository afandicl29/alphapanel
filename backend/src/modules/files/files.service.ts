import { Injectable } from '@nestjs/common';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class FilesService {
  constructor(private daemon: DaemonClientService) {}

  list(path: string, username: string) {
    return this.daemon.execute({ action: 'files.list', payload: { path, username } });
  }

  upload(path: string, username: string, filename: string) {
    return this.daemon.execute({ action: 'files.upload', payload: { path, username, filename } });
  }

  chmod(path: string, mode: string, username: string) {
    return this.daemon.execute({ action: 'files.chmod', payload: { path, mode, username } });
  }

  extractZip(path: string, username: string) {
    return this.daemon.execute({ action: 'files.unzip', payload: { path, username } });
  }
}
