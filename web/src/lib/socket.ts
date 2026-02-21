import type { QueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>;
  queryClient: QueryClient | null;

  connect: (token: string, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string, currentUser: User) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
};

const SOCKET_URL =
  import.meta.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  queryClient: null,

  connect: (token, queryClient) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected || !queryClient) return;
    if (existingSocket) existingSocket.disconnect();
    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      console.log("Socket connected, id:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });

    socket.on("disconnect", (error) => {
      console.log("Socket error:", error);
    });

    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers: onlineUsers };
      });
    });

    socket.on("typing", ({ userId, chatId, isTyping }: TypingEventProps) => {
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        if (isTyping) typingUsers.set(chatId, userId);
        else typingUsers.delete(chatId);
        return { typingUsers: typingUsers };
      });
    });

    socket.on("new-message", (message) => {
      const senderId = message.sender?._id;

      queryClient.setQueryData<Message[]>(["messages", message.chat], (old) => {
        if (!old) return [message];
        const filtered = old.filter((m) => !m._id.startsWith("temp-"));
        const exists = filtered.some((m) => m._id === message._id);
        return exists ? filtered : [...filtered, message];
      });

      queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
        return oldChats?.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: {
                _id: message._id,
                text: message.text,
                sender: senderId,
                createdAt: message.createdAt,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return chat;
        });
      });

      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers };
      });
    });

    set({ socket, queryClient });
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        onlineUsers: new Set(),
        typingUsers: new Map(),
        queryClient: null,
      });
    }
  },

  joinChat: (chatId) => {
    get().socket?.emit("join-chat", chatId);
  },

  leaveChat: (chatId) => {
    get().socket?.emit("leave-chat", chatId);
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      chat: chatId,
      sender: currentUser,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<Message[]>(
      ["messages", chatId],
      (old: Message[] | undefined) => {
        if (!old) return [optimisticMessage];
        return [...old, optimisticMessage];
      },
    );

    queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
      if (!oldChats) return [];

      return oldChats.map((chat) => {
        if (chat._id === chatId) {
          return {
            ...chat,
            lastMessage: {
              _id: tempId,
              text,
              sender: currentUser,
              createdAt: new Date().toISOString(),
            },
            lastMessageAt: new Date().toISOString(),
          };
        }
        return chat;
      });
    });

    socket.emit("send-message", { chatId, text });

    socket.once("socket-error", () => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
        if (!old) return [];
        return old.filter((m) => m._id !== tempId);
      });
    });
  },

  setTyping: (chatId, isTyping) => {
    get().socket?.emit("typing", { chatId, isTyping });
  },
}));
