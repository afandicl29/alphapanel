import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * Web SSH terminal via xterm.js — PTY handled by daemon on Linux.
 * Production: authenticate socket + bind to user home only.
 */
@WebSocketGateway({ namespace: '/terminal', cors: { origin: '*' } })
export class TerminalGateway {
  @SubscribeMessage('terminal:input')
  handleInput(@MessageBody() data: { input: string }, @ConnectedSocket() client: Socket) {
    client.emit('terminal:output', { data: `[AlphaPanel] Echo: ${data.input}` });
  }

  @SubscribeMessage('terminal:resize')
  handleResize(@MessageBody() _data: { cols: number; rows: number }) {
    // Forward to daemon PTY
  }
}
