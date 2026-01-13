import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/db.js";
import { initWebSocket } from "./ws/index.js";
dotenv.config();
const server = http.createServer(app);
initWebSocket(app);
const PORT = 3000;
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`HTTP + WS running on ${PORT}`);
    });
})();
//# sourceMappingURL=index.js.map