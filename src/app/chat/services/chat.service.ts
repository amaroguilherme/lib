import { Injectable } from '@angular/core';
import { ChatModule } from '../chat.module';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { AllChatsQuery, USER_CHATS_QUERY } from './chat.graphql';
import { map } from 'rxjs/operators';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: ChatModule
})
export class ChatService {

  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) { }

  getUserChats(): Observable<Chat[]> {
    return this.apollo.query<AllChatsQuery>({
      query: USER_CHATS_QUERY,
      variables: {
        userId: this.authService.authUser.id
      }
    }).pipe(map(res => res.data.allChats));
  }
}
