import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/db.js";
import { initWebSocket } from "./ws/index.js";
import cors from "cors"

dotenv.config();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
const server = http.createServer(app);

initWebSocket(server);

const PORT = 3000;

(async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`HTTP + WS running on ${PORT}`);
    });
})();