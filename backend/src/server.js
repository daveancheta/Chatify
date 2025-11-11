import express from "express";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/messages.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

dotenv.config();

const app = express();
const __dirname = path.resolve()

const PORT = ENV.PORT || 3000;

app.use(express.json())
app.use(cookieParser())


console.log(ENV.PORT)

app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)

//make ready for deplyment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {console.log("Server is running on port " + PORT)
connectDB()})