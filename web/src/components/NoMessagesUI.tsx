import { MessageSquareIcon } from "lucide-react";

const NoMessagesUI = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-base-300/40 flex items-center justify-center">
        <MessageSquareIcon className="w-8 h-8 text-base-content/20" />
      </div>
      <div className=" flex flex-col gap-1">
        <p className="text-base-content/70">No messages yet</p>
        <p className="text-base-content/60 text-sm">
          Send a message to start the conversation
        </p>
      </div>
    </div>
  );
};

export default NoMessagesUI;
