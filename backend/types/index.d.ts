import type { Request } from "express";
import type { Document } from "mongoose";
import type { Socket } from "socket.io";

type AuthRequest = Request & { userId?: string };

type IChat = Document & {
  participants: mongoose.Types.ObjectId[];
  lastmessage?: mongoose.Types.ObjectId;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type IMessage = Document & {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text?: string;
  createdAt: Date;
  updatedAt: Date;
};

type IUser = Document & {
  clerkId: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

type SocketWithUserId = Socket & { userId: string };

type MessageDataType = {
  chatId: string;
  text: string;
};

type TypingProps = { chatId: string; isTyping: boolean };
