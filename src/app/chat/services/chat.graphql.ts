import gql from 'graphql-tag';
import { Chat } from '../models/chat.model';
import { FileFragment } from 'src/app/core/services/file.graphql';

export interface AllChatsQuery {
  allChats: Chat[];
}

export interface ChatQuery {
  Chat: Chat;
}

const ChatFragment = gql`
  fragment ChatFragment on Chat {
    id
    title
    createdAt
    isGroup
    users(
      first: 1,
      filter: {
        id_not: $loggedUserId
      }
    ) {
      id
      name
      email
      createdAt
      photo {
        ...FileFragment
      }
    }
  }
  ${FileFragment}
`;

const ChatMessagesFragment = gql`
  fragment ChatMessagesFragment on Chat {
    messages(
      last: 1
    ) {
      id
      createdAt
      text
      sender {
        id
        name
      }
    }
  }
`;

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
        createdAt
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

export const CREATE_PRIVATE_CHAT_MUTATION = gql`
  mutation CreatePrivateChatMutation($loggedUserId: ID!, $targetUserId: ID!) {
    createChat(
      usersIds: [
        $loggedUserId,
        $targetUserId
      ]
    ) {
      id
      title
      createdAt
      isGroup
      users(
        first: 1,
        filter: {
          id_not: $loggedUserId
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
        createdAt
        text
        sender {
          id
          name
        }
      }
    }
  }
`;

export const USER_CHATS_SUBSCRIPTION = gql`
  subscription UserChatsSubscription($loggedUserId: ID!) {
    Chat(
      filter: {
        mutation_in: [CREATED, UPDATED],
        node: {
          users_some: {
            id: $loggedUserId
          }
        }
      }
    ) {
      mutation
      node {
        ...ChatFragment
        ...ChatMessagesFragment
      }
    }
  }
  ${ChatFragment}
  ${ChatMessagesFragment}
`;
