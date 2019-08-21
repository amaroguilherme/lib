import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  chats$: Observable<Chat[]>;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.chats$ = this.chatService.getUserChats();
  }

  getChatTitle(chat: Chat): string {
    return chat.title || chat.users[0].name;
  }
}
