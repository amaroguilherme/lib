import { User } from "./user.model";
import { Chat } from "src/app/chat/models/chat.model";

export interface FileModel {
  id: string;
  secret?: string;
  name?: string;
  size?: number;
  url?: string;
  contentType?: string;
  user?: User;
  chat?: Chat;
}