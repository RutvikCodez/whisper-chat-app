import mongoose, { Schema, type Document } from "mongoose";
import type { IUser } from "../../types";

const userSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  avatar: {
    type: String,
    default: "",
  },
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>("User", userSchema);