import { verifyToken } from "@clerk/express";
import { Server as HTTPServer } from "http";
import { Socket, Server as SocketServer } from "socket.io";
import { User } from "../models/User";
import type { meesageDataType, SocketWithUserId } from "../../types";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

const olineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HTTPServer) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    process.env.FRONTEND_URL as string,
  ];
  const io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const clerkId = session.sub;
      const user = await User.findOne({ clerkId });
      if (!user) return next(new Error("User not found"));
      (socket as SocketWithUserId).userId = user._id.toString();
      next();
    } catch (error: any) {
      next(new Error(error));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId;

    socket.emit("online-users", { userIds: Array.from(olineUsers.keys()) });

    olineUsers.set(userId, socket.id);

    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on("sent-message", async (data: meesageDataType) => {
      try {
        const { chatId, text } = data;
        const chat = await Chat.findOne({
          _id: chatId,
          participants: userId,
        });
        if (!chat)
          return socket.emit("socket-error", { message: "Chat not found" });
        const message = await Message.create({
          chat: chatId,
          sender: userId,
          text,
        });
        chat.lastmessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();
        await message.populate("sender", "name email avatar");
        io.to(`chat:${chatId}`).emit("new-message", message);

        for (const participantId of chat.participants) {
          io.to(`user:${participantId}`).emit("new-message", message);
        }
      } catch (error) {
        socket.emit("socket-error", { message: "Chat not found" });
      }
    });

    socket.on("typing", async (data) => {});

    socket.on("disconnect", () => {
      olineUsers.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
    });
  });
};
