import { User } from 'src/app/core/models/user.model';
import { Message } from './message.model';

export class Chat {

  id?: string;
  createdAt?: string;
  isGroup?: boolean;
  title?: string;
  users?: User[];
  messages?: Message[];

}