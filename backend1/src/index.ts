// websocket in nodejs
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager.js';
import http from 'http';

const PORT = process.env.PORT || 8080;

// Create an HTTP server just to attach WebSocket to it
const server = http.createServer();

// Attach WebSocket server to same HTTP server
const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', (ws) => {
  gameManager.addUser(ws);

  ws.on('close', () => gameManager.removeUser(ws));
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
