import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../types";
import { Chat } from "../models/Chat";

export const getChats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastmessage")
      .sort({ lastMessageAt: -1 });
    const formattedChats = chats.map((chat) => {
      const otherParticipants = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );
      return {
        _id: chat._id,
        participant: otherParticipants,
        lastmessage: chat.lastmessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });
    res.json(formattedChats);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const getOrCreateChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastmessage");
    if (!chat) {
      const newChat = new Chat({
        participants: [userId, participantId],
      });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }
    const otherParticipants = chat.participants.find(
      (p) => p._id.toString() !== userId,
    );
    res.json({
        _id: chat._id,
        participant: otherParticipants ?? null,
        lastmessage: chat.lastmessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
