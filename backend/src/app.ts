import express from "express";
import userRoutes from "./routes/user.js";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/v1", userRoutes);

app.get("/hii", (_, res) => {
    res.json({ msg: "Server is alive" });
});

export default app;