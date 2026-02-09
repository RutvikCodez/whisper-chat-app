import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoute";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler";
import path from "path";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:5173",
  "http://10.201.88.209:3000:5173",
  "http://10.201.88.209:3000:8081",
  process.env.FRONTEND_URL!,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist", "public")));
  app.get("/{*any}", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
  });
}

export default app;
