import mongoose, { Schema } from "mongoose";
import type { IMessage } from "../../types";

const messageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ chat: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
