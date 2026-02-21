import { UserButton } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useSocketStore } from "../lib/socket";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useChats, useGetOrCreateChat } from "../hooks/useChats";
import { useMessages } from "../hooks/useMessages";
import { PlusIcon, SparklesIcon } from "lucide-react";
import NoConversationsUI from "../components/NoConversationsUI";
import { ChatListItem } from "../components/ChatListItem";
import NoMessagesUI from "../components/NoMessagesUI";
import { ChatHeader } from "../components/ChatHeader";
import { MessageBubble } from "../components/MessageBubble";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ChatInput } from "../components/ChatInput";
import NoChatSelectedUI from "../components/NoChatSelectedUI";
import { NewChatModal } from "../components/NewChatModal";

const ChatPage = () => {
  const { data: currentUser } = useCurrentUser();
  const { socket, sendMessage, setTyping } = useSocketStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get("chat");
  const [messageInput, setMessageInput] = useState("");
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | undefined>(undefined);
  useSocketConnection(activeChatId || "");
  const { data: chats = [], isLoading: chatsLoading } = useChats();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(
    activeChatId || "",
  );
  const startChatMutation = useGetOrCreateChat();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, messages]);

  const handleStartChat = (participantId: string) => {
    startChatMutation.mutate(participantId, {
      onSuccess: (chat) => {
        setSearchParams({ chat: chat._id });
      },
    });
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !socket || !currentUser)
      return;
    const text = messageInput.trim();
    const formattedUser = {
      _id: currentUser.id,
      name: currentUser.fullName || currentUser.username || "Unknown",
      email: currentUser.primaryEmailAddress?.emailAddress || "",
      avatar: currentUser.imageUrl,
    };
    sendMessage(activeChatId, text, formattedUser);
    setMessageInput("");
    setTyping(activeChatId, false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (!activeChatId) return;
    setTyping(activeChatId, true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeChatId, false);
    }, 3000);
  };

  const activeChat = chats?.find((chat) => chat._id === activeChatId);

  return (
    <div className="h-screen bg-base-100 text-base-content grid grid-cols-[20rem_1fr]">
      <div className="w-full border-r border-base-300 flex flex-col bg-base-200">
        <div className="p-4 border-b border-base-300 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link to="/chat" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400
               to-orange-500 flex items-center justify-center"
              >
                <SparklesIcon className="w-4 h-4 text-primary-content" />
              </div>
              <span className="font-bold">Whisper</span>
            </Link>
            <UserButton />
          </div>
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="btn btn-primary btn-block gap-2 rounded-xl bg-linear-to-r
             from-amber-500 to-orange-500 border-none"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatsLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-spinner loading-sm text-amber-400" />
            </div>
          )}

          {chats.length === 0 && !chatsLoading && <NoConversationsUI />}

          <div className="flex flex-col gap-1">
            {chats.map((chat) => (
              <ChatListItem
                key={chat._id}
                chat={chat}
                isActive={activeChatId === chat._id}
                onClick={() => setSearchParams({ chat: chat._id })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeChatId && activeChat ? (
          <>
            <ChatHeader
              participant={activeChat.participant}
              chatId={activeChatId}
            />
            <div className="flex-1 overflow-y-auto p-6  flex flex-col gap-4">
              {messagesLoading && (
                <div className="flex items-center justify-center h-full">
                  <span className="loading loading-spinner loading-md text-amber-400" />
                </div>
              )}

              {messages.length === 0 && !messagesLoading && <NoMessagesUI />}

              {messages.length > 0 &&
                messages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    currentUser={currentUser}
                  />
                ))}

              <div ref={messageEndRef} />
            </div>

            <ChatInput
              value={messageInput}
              onChange={handleTyping}
              onSubmit={handleSend}
              disabled={!messageInput.trim()}
            />
          </>
        ) : (
          <NoChatSelectedUI />
        )}
      </div>
       <NewChatModal
        onStartChat={handleStartChat}
        isPending={startChatMutation.isPending}
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />
    </div>
  );
};

export default ChatPage;
