import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";
import { useEffect } from "react";

export const useSocketConnection = (activeChatId?: string) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

  useEffect(() => {
    let cancelled = false;
    if (!isSignedIn) {
      disconnect();
      return;
    }

    getToken()
      .then((token) => {
        if (!cancelled && token) {
          connect(token, queryClient);
        }
      })
      .catch((error) => {
        console.error("Failed to get auth token:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [connect, disconnect, getToken, isSignedIn, queryClient]);

  useEffect(() => {
    if (activeChatId && socket) {
      joinChat(activeChatId);
      return () => leaveChat(activeChatId);
    }
  }, [activeChatId, joinChat, leaveChat, socket]);
};
