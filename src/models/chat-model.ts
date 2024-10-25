import mongoose, { Document, Schema, model, Types } from "mongoose";

interface IChat extends Document {
  users: Types.ObjectId[];
  createdBy: Types.ObjectId;
  lastMessage: Types.ObjectId;
  isGroupChat: boolean;
  groupName?: string;
  groupProfilePicture?: string;
  groupBio?: string;
  groupAdmins?: Types.ObjectId[];
  unreadCounts?: Record<string, number>;
  lastMessageAt?: string;
  userIds?: string;
}

const chatSchema = new Schema<IChat>(
  {
    users: {
      type: [Schema.Types.ObjectId],
      ref: "users",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupProfilePicture: {
      type: String,
      default: "",
    },
    groupBio: {
      type: String,
      default: "",
    },
    groupAdmins: {
      type: [Schema.Types.ObjectId],
      ref: "users",
    },
    unreadCounts: {
      type: Object,
      default: {},
    },
    lastMessageAt: {
      type: String,
      default: "",
    },
    userIds: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

chatSchema.pre<IChat>("save", function (next) {
  if (!this.isGroupChat) {
    const sortedUserIds = this.users.map((user) => user.toString()).sort();
    this.userIds = sortedUserIds.join("_");
  } else {
    this.userIds = undefined; // Ensure it's undefined for group chats
  }
  next();
});

chatSchema.index({ userIds: 1 }, { unique: true, sparse: true });

if (mongoose.models && mongoose.models["chats"]) {
  mongoose.deleteModel("chats");
}

if (!mongoose.models["messages"]) {
  require("./message-model");
}

const ChatModel = mongoose.model("chats", chatSchema);

export default ChatModel;