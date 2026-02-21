import { useSocketStore } from "../lib/socket";
import { formatTime } from "../lib/utils";
import { clsx } from "clsx";

export function ChatListItem({
  chat,
  isActive,
  onClick,
  ...props
}: ChatListItemProps) {
  const { onlineUsers, typingUsers } = useSocketStore();
  const isOnline = onlineUsers.has(chat.participant?._id);
  const isTyping = !!typingUsers.get(chat._id);

  return (
    <button
      onClick={onClick}
      className={clsx(
        "btn btn-ghost justify-start gap-3 px-4 py-8 rounded-xl w-full normal-case",
        isActive && "bg-white/10",
      )}
      {...props}
    >
      <div className="relative">
        <img
          src={chat.participant?.avatar || "/default-avatar.png"}
          alt={`${chat.participant?.name || "Unknown"}'s avatar`}
          className="w-11 h-11 rounded-full bg-base-300/40"
        />{" "}
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-200" />
        )}
      </div>
      <div className="flex-1 text-left min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">
            {chat.participant?.name || "Unknown"}
          </span>
          {chat.lastMessageAt && (
            <span className="text-xs text-base-content/60">
              {formatTime(chat.lastMessageAt)}
            </span>
          )}
        </div>
        <p className="text-xs text-base-content/70 truncate">
          {isTyping ? "typing..." : chat.lastmessage?.text || "No messages yet"}
        </p>
      </div>
    </button>
  );
}
