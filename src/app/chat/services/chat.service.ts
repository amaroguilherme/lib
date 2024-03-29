import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { AllChatsQuery, USER_CHATS_QUERY, ChatQuery, CHAT_BY_ID_OR_USERS_QUERY, CREATE_PRIVATE_CHAT_MUTATION, USER_CHATS_SUBSCRIPTION } from './chat.graphql';
import { map } from 'rxjs/operators';
import { Chat } from '../models/chat.model';
import { DataProxy } from 'apollo-cache';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { USER_MESSAGES_SUBSCRIPTION, AllMessagesQuery, GET_MESSAGES_QUERY } from './message.graphql';
import { Message } from '../models/message.model';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chats$: Observable<Chat[]>;
  private subscriptions: Subscription[] = [];
  private queryRef: QueryRef<AllChatsQuery>;

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  startChatsMonitoring(): void {
    if (!this.chats$) {
      this.chats$ = this.getUserChats();
      this.subscriptions.push(this.chats$.subscribe());
      this.router.events.subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd && !this.router.url.includes('chat')) {
          this.onDestroy();
          this.userService.stopUsersMonitoring();
        }
      });
    }
  }

  getUserChats(): Observable<Chat[]> {
    this.queryRef = this.apollo.watchQuery<AllChatsQuery>({
      query: USER_CHATS_QUERY,
      variables: {
        userId: this.authService.authUser.id
      },
      fetchPolicy: 'network-only'
    });

    this.queryRef.subscribeToMore({
      document: USER_CHATS_SUBSCRIPTION,
      variables: { loggedUserId: this.authService.authUser.id },
      updateQuery: (previous, { subscriptionData }) => {
        const newChat: Chat = subscriptionData.data.Chat.node;

        if (previous.allChats.every(chat => chat.id !== newChat.id)) {
          return {
            ...previous,
            allChats: [newChat, ...previous.allChats]
          };
        }
        return previous;
      }
    });

    this.queryRef.subscribeToMore({
      document: USER_MESSAGES_SUBSCRIPTION,
      variables: { loggedUserId: this.authService.authUser.id },
      updateQuery: (previous, { subscriptionData }) => {
        const newMessage: Message = subscriptionData.data.Message.node;

        try {
          if (newMessage.sender.id !== this.authService.authUser.id) {
            const apolloClient = this.apollo.getClient();
            const chatMessagesVariables = { chatId: newMessage.chat.id };
            const chatMessagesData = apolloClient.readQuery<AllMessagesQuery>({
              query: GET_MESSAGES_QUERY,
              variables: chatMessagesVariables
            });

            chatMessagesData.allMessages = [...chatMessagesData.allMessages, newMessage];

            apolloClient.writeQuery({
              query: GET_MESSAGES_QUERY,
              variables: chatMessagesVariables,
              data: chatMessagesData
            });
          }
        } catch (e) {}

        const chatToUpdateIndex: number = (previous.allChats) ? previous.allChats.findIndex(chat => chat.id === newMessage.chat.id) : -1;

        if (chatToUpdateIndex > -1) {
          const newAllChats = [...previous.allChats];
          const chatToUpdate: Chat = Object.assign({}, newAllChats[chatToUpdateIndex]);
          chatToUpdate.messages = [newMessage];
          newAllChats[chatToUpdateIndex] = chatToUpdate;
          return {
            ...previous, allChats: newAllChats
          };
        }
        return previous;
      }
    });

    return this.queryRef.valueChanges.pipe(map(res => res.data.allChats),
      map((chats: Chat[]) => {
        const chatsToSort = chats.slice();
        return chatsToSort.sort((a, b) => {
          const valueA = (a.messages.length > 0) ? new Date(a.messages[0].createdAt).getTime() : new Date(a.createdAt).getTime();
          const valueB = (b.messages.length > 0) ? new Date(b.messages[0].createdAt).getTime() : new Date(b.createdAt).getTime();

          return valueB - valueA;
        })
      })
    );
  }

  getChatByIdOrUsers(chatOrUserId: string): Observable<Chat> {
    return this.apollo.query<ChatQuery | AllChatsQuery>({
      query: CHAT_BY_ID_OR_USERS_QUERY,
      variables: {
        chatId: chatOrUserId,
        loggedUserID: this.authService.authUser.id,
        targetUserID: chatOrUserId
      }
    }).pipe(map(res => (res.data['Chat']) ? res.data['Chat'] : res.data['allChats'][0]));
  }

  createPrivateChat(targetUserId: string): Observable<Chat> {
    return this.apollo.mutate({
      mutation: CREATE_PRIVATE_CHAT_MUTATION,
      variables: {
        loggedUserId: this.authService.authUser.id,
        targetUserId
      },
      update: (store: DataProxy, {data: {createChat}}) => {
        const userChatsVariables = {userId: this.authService.authUser.id};
        const userChatsData = store.readQuery<AllChatsQuery>({
          query: USER_CHATS_QUERY,
          variables: userChatsVariables
        });
        userChatsData.allChats = [createChat, ...userChatsData.allChats];
        store.writeQuery({
          query: USER_CHATS_QUERY,
          variables: userChatsVariables,
          data: userChatsData
        });

        const variables = {
          chatId: targetUserId,
          loggedUserID: this.authService.authUser.id,
          targetUserID: targetUserId
        };
        const data = store.readQuery<AllChatsQuery>({
          query: CHAT_BY_ID_OR_USERS_QUERY,
          variables
        });
        data.allChats = [createChat];

        store.writeQuery({
          query: CHAT_BY_ID_OR_USERS_QUERY,
          variables,
          data
        });
      }
    }).pipe(map(res => res.data.createChat));
  }

  private onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }
}
