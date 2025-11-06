"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// websocket in nodejs
const ws_1 = require("ws");
const GameManager_js_1 = require("./GameManager.js");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_js_1.GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});
//# sourceMappingURL=index.js.map