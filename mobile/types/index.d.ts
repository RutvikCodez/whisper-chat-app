type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

type MessageSender = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

type Message = {
  _id: string;
  chat: string;
  sender: MessageSender | string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

type ChatLastMessage = {
  _id: string;
  text: string;
  sender: string;
  createdAt: string;
};

type Chat = {
  _id: string;
  participant: MessageSender;
  lastMessage: ChatLastMessage | null;
  lastMessageAt: string;
  createdAt: string;
};

type MenuItemsType = {
  icon: string;
  color: string;
  label: string;
  value?: string;
  isLast?: boolean;
};

type AnimatedOrbProps = {
  colors: [string, string, ...string[]];
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
};
