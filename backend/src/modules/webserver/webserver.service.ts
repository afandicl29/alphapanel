import { Injectable } from '@nestjs/common';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class WebserverService {
  constructor(private daemon: DaemonClientService) {}

  status() {
    return this.daemon.execute({ action: 'webserver.status', payload: {} });
  }

  setNginxConfig(hostingAccountId: string, config: string) {
    return this.daemon.execute({
      action: 'nginx.config',
      payload: { hostingAccountId, config },
    });
  }

  setReverseProxy(hostingAccountId: string, upstream: string, path = '/') {
    return this.daemon.execute({
      action: 'nginx.reverse_proxy',
      payload: { hostingAccountId, upstream, path },
    });
  }

  enableApache(hostingAccountId: string, enabled: boolean) {
    return this.daemon.execute({
      action: 'apache.toggle',
      payload: { hostingAccountId, enabled },
    });
  }
}
