import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../../types";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export const authCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });
    let user = await User.findOne({ clerkId });
    if (!user) {
      const { firstName, lastName, emailAddresses, imageUrl } =
        await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        name: firstName
          ? `${firstName} ${lastName || ""}`.trim()
          : emailAddresses[0]?.emailAddress.split("@")[0],
        email: emailAddresses[0]?.emailAddress,
        avatar: imageUrl,
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500);
    next();
  }
};
