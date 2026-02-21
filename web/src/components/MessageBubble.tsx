import clsx from "clsx";
import { formatTime } from "../lib/utils";

export function MessageBubble({
  message,
  currentUser,
  ...props
}: MessageBubbleProps) {
  const isMe = message.sender?._id === currentUser?._id;

  return (
    <div
      className={clsx("flex", isMe ? "justify-end" : "justify-start")}
      {...props}
    >
      <div
        className={clsx(
          "max-w-md px-4 py-2.5 rounded-2xl flex gap-3 items-center",
          isMe
            ? "bg-linear-to-r from-amber-500 to-orange-500 text-primary-content"
            : "bg-base-300/40 text-base-content",
        )}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={clsx(
            "text-xs",
            isMe ? "text-primary-content/80" : "text-base-content/70",
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
