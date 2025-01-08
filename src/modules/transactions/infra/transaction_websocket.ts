import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust the origin for your requirements
  },
})
export class TransactionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>(); // Map to store userId and socketId

  // Handle connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  // Assign a user to their socket
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    this.users.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  // Send message to a specific user
  sendMessageToUser(userId: string, message: any) {
    const socketId = this.users.get(userId);
    console.log('Send message', socketId);
    if (socketId) {
      this.server.to(socketId).emit('transaction', message);
    } else {
      console.log(`User with ID ${userId} is not connected.`);
    }
  }
}
