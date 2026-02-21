import { MessageSquareIcon } from "lucide-react";

const NoConversationsUI = () => {
  return (
    <div className="items-center justify-center py-12 px-4 text-center flex flex-col gap-1">
      <div className="flex flex-col gap-3 justify-center items-center">
        <MessageSquareIcon className="w-10 h-10 text-amber-400" aria-hidden="true" />
        <p className="text-base-content/70 text-sm">No conversations yet</p>
      </div>
      <p className="text-base-content/60 text-xs">
        Start a new chat to begin
      </p>
    </div>
  );
};

export default NoConversationsUI;
