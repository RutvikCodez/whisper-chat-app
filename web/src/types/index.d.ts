type StatItemProps = {
  value: string;
  label: string;
};

type TypingEventProps = { userId: string; chatId: string; isTyping: boolean };

type Message = {
  _id: string;
  chat: string;
  sender: User;
  text: string;
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

type Chat = {
  _id: string;
  participant: MessageSender;
  lastmessage: ChatLastMessage | null;
  lastMessageAt: string;
  createdAt: string;
};

type ChatListItemProps = {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
};

type ChatHeaderProps = {
  participant: MessageSender;
  chatId: string;
};

type MessageBubbleProps = {
  message: Message;
  currentUser: User;
};

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit:(e: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
};

type NewChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (participantId: string) => void;
  isPending: boolean;
};