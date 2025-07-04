"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type == "chat") {
            const currentRoomUser = allSockets.find((x) => x.socket == socket);
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == (currentRoomUser === null || currentRoomUser === void 0 ? void 0 : currentRoomUser.room)) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    socket.on("disconnect", () => {
        allSockets = allSockets.filter((x) => x.socket != socket);
    });
});
