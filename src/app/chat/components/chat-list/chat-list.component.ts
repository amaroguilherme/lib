import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  chats$: Observable<Chat[]>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.chats$ = this.chatService.chats$;
  }

  getChatTitle(chat: Chat): string {
    return chat.title || chat.users[0].name;
  }

  getLastMessage(chat: Chat): string {
    const message = chat.messages[0];
    if (message) {
      const sender = (message.sender.id === this.authService.authUser.id) ? 'You' : message.sender.name;
      return `${sender}: ${message.text}`;
    }
    return 'No Messages'
  }
}
