import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class DockerService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list() {
    return this.prisma.dockerContainer.findMany();
  }

  async create(name: string, image: string, ports?: Record<string, string>, hostingAccountId?: string) {
    const result = await this.daemon.execute({
      action: 'docker.create',
      payload: { name, image, ports },
    });
    return this.prisma.dockerContainer.create({
      data: {
        name,
        image,
        ports: ports ?? {},
        status: result.success ? 'RUNNING' : 'ERROR',
        hostingAccountId,
      },
    });
  }

  restart(id: string) {
    return this.daemon.execute({ action: 'docker.restart', payload: { id } });
  }

  compose(composeFile: string, name: string) {
    return this.daemon.execute({
      action: 'docker.compose',
      payload: { composeFile, name },
    });
  }
}
