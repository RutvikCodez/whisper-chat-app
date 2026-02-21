import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "../lib/socket";
import { useEffect } from "react";

export const useSocketConnection = (activeChatId?: string) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { socket, connect, disconnect, joinChat, leaveChat } = useSocketStore();

  useEffect(() => {
    if (!isSignedIn) {
      disconnect();
      return;
    }

    getToken().then((token) => {
      if (token) connect(token, queryClient);
    });
  }, [connect, disconnect, getToken, isSignedIn, queryClient]);

  useEffect(() => {
    if (activeChatId && socket) {
      joinChat(activeChatId);
      return () => leaveChat(activeChatId);
    }
  }, [activeChatId, joinChat, leaveChat, socket]);
};
