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
  lastMessage: ChatLastMessage | null;
  lastMessageAt: string;
  createdAt: string;
};