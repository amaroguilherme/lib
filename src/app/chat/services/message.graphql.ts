import gql from 'graphql-tag'
import { Message } from '../models/message.model';

export interface AllMessagesQuery {
  allMessages: Message[];
}

const MessageFragment = gql `
  fragment MessageFragment on Message {
    id
    text
    createdAt
    sender {
      id
      name
      email
      createdAt
    }
    chat {
      id
    }
  }
`

export const GET_MESSAGES_QUERY = gql`
  query GetMessagesQuery($chatId: ID!) {
    allMessages(
      filter: {
        chat: {
          id: $chatId
        }
      },
      orderBy: createdAt_ASC
    ) {
      ...MessageFragment
    }
  }
  ${MessageFragment}
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($text: String!, $chatId: ID!, $senderId: ID!){
    createMessage(
      text: $text,
      chatId: $chatId,
      senderId: $senderId
    ) {
      ...MessageFragment
    }
  }
  ${MessageFragment}
`;

export const USER_MESSAGES_SUBSCRIPTION = gql `
  subscription UserMessagesSubscription($loggerUserId: ID!) {
    Message(
      filter: {
        mutation_in: [CREATED],
        node: {
          chat: {
            users_some: {
              id: $loggerUserId
            }
          }
        }
      }
    ) {
      mutation
      node {
        ...MessageFragment
      }
    }
  }
  ${MessageFragment}
`;
