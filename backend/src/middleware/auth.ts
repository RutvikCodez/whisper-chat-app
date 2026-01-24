import { getAuth, requireAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import type { AuthRequest } from "../../types";

export const protectRoute = [
  requireAuth(),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);
      if (!clerkId)
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      const user = await User.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: "User not found" });
      req.userId = user._id.toString();
      return next();;
    } catch (error) {
      console.error("Error in Protect Route Middleware", error);
      return res.status(500).json({ message: "Internal server Error" });
    }
  },
];
