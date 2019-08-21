import gql from 'graphql-tag';
import { Chat } from '../models/chat.model';

export interface AllChatsQuery {
  allChats: Chat[];
}

export interface ChatQuery {
  Chat: Chat;
}

export const USER_CHATS_QUERY = gql `
  query UserChatsQuery($userId: ID!) {
    allChats(
      filter: {
        users_some: {
          id: $userId
        }
      }
    ) {
      id
      title
      createdAt
      isGroup
      users(
        first: 1,
        filter: {
          id_not: $userId
        }
      ) {
        id
        name
        email
        createdAt
      }
      messages(
        last: 1
      ) {
        id
        text
        sender {
          id
          name
        }
      }
    }
  }
`;

export const CHAT_BY_ID_OR_USERS_QUERY = gql `
  query ChatByIdOrUsersQuery($chatId: ID!, $loggedUserID: ID!, $targetUserID: ID!){
    Chat(
      id: $chatId
    ) {
      id
      title
      createdAt
      isGroup
      users(
        first: 1,
        filter: {
          id_not: $loggedUserID
        }
      ) {
        id
        name
        email
        createdAt
      }
    }
    allChats(
      filter: {
        AND: [
          { users_some: { id: $loggedUserID } },
          { users_some: { id: $targetUserID } }
        ],
        isGroup: false
      }
    ) {
      id
      title
      createdAt
      isGroup
      users(
        first: 1,
        filter: {
          id_not: $loggedUserID
        }
      ) {
        id
        name
        email
        createdAt
      }
    }
  }
`;