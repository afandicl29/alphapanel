import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MetricsService } from '../metrics/metrics.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/realtime' })
export class RealtimeGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private metrics: MetricsService) {}

  afterInit() {
    setInterval(async () => {
      const data = await this.metrics.getLiveMetrics();
      this.server.emit('metrics:update', data);
    }, 5000);
  }
}
