import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { AllMessagesQuery, GET_MESSAGES_QUERY, CREATE_MESSAGE_MUTATION } from './message.graphql';
import { map } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { DataProxy } from 'apollo-cache';
import { AuthService } from 'src/app/core/services/auth.service';
import { AllChatsQuery, USER_CHATS_QUERY } from './chat.graphql';
import { User } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private apollo: Apollo,
    private authService: AuthService
  ) { }

  getMessages(chatId: string): Observable<Message[]> {
    return this.apollo.watchQuery<AllMessagesQuery>({
      query: GET_MESSAGES_QUERY,
      variables: { chatId },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(map(res => res.data.allMessages),
                        map(messages => messages.map(m => {
                          const message = Object.assign({}, m);
                          message.sender = new User(message.sender);
                          return message;
                        })));
  }

  createMessage(message: {text: string, chatId: string, senderId: string}): Observable<Message>{
    return this.apollo.mutate({
      mutation: CREATE_MESSAGE_MUTATION,
      variables: message,
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          id: '',
          text: message.text,
          createdAt: new Date().toISOString(),
          sender: {
            __typename: 'User',
            id: message.senderId,
            name: '',
            email: '',
            createdAt: ''
          },
          chat: {
            __typename: 'Chat',
            id: message.chatId
          }
        }
      },
      update: (store: DataProxy, {data: {createMessage}}) => {
        try {
          const data = store.readQuery<AllMessagesQuery>({
            query: GET_MESSAGES_QUERY,
            variables: {chatId: message.chatId}
          });
          data.allMessages = [...data.allMessages, createMessage];
          store.writeQuery({
            query: GET_MESSAGES_QUERY,
            variables: {chatId: message.chatId},
            data
          });
        } catch (e) {}

        try {
          const userChatsVariables = {userId: this.authService.authUser.id};

          const userChatsData = store.readQuery<AllChatsQuery>({
            query: USER_CHATS_QUERY,
            variables: userChatsVariables
          });

          const newUserChatsList = [...userChatsData.allChats];

          newUserChatsList.map(c => {
            if (c.id === createMessage.chat.id) {
              c.messages = [createMessage];
            }
            return c;
          });

          userChatsData.allChats = newUserChatsList;

          store.writeQuery({
            query: USER_CHATS_QUERY,
            variables: userChatsVariables,
            data: userChatsData
          });

        } catch (e) {}

      }
    }).pipe(map(res => res.data.createMessage));
  }
}
