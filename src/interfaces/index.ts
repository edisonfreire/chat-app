export interface UserType {
  _id: string;
  clerkUserId: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatType {
  _id: string;
  users: UserType[];
  createdBy: UserType;
  lastMessage: MessageType;
  isGroupChat: boolean;
  groupName: string;
  groupProfilePicture: string;
  groupAdmins: UserType[];
  unreadCounts: Record<string, number>;
  createdAt: string;
}

export interface MessageType {
  _id: string;
  chatId: ChatType;
  sender: UserType;
  text: string;
  image: string;
  readBy: UserType[];
  createdAt: string;
  updatedAt: string;
}