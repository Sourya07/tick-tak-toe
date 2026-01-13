import WebSocket, { WebSocketServer } from "ws";
// import { handleMessage } from "./wsRouter.js";
import { authenticateSocket } from "./wsAuth.js";
export function initWebSocket(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", (ws, req) => {
        const user = authenticateSocket(req);
        if (!user) {
            ws.close();
            console.log("hello there is no user");
            return;
        }
        // attach identity
        ws.userId = user.userId;
        ws.on("message", (data) => {
            // handleMessage(ws, data.toString(), wss);
            if (data.toString() == "ping") {
                ws.send("pong");
            }
        });
    });
}
//# sourceMappingURL=index.js.map