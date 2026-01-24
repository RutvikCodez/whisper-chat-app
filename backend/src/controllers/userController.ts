import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import type { AuthRequest } from "../../types";

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500);
    next(error);
  }
};
