import { User } from '../models/user.model';
import gql from 'graphql-tag';

export interface AllUsersQuery {
  allUsers: User[];
}
export interface UserQuery {
  User: User;
}

export const ALL_USERS_QUERY =  gql `
  query AllUsersQuery($idToExclude: ID!) {
    allUsers(
      orderBy: name_ASC,
      filter: {
        id_not: $idToExclude
      }
    ) {
      id
      name
      email
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql `
  query GetUserByIdQuery($userId: ID!) {
    User(id: $userId) {
      id
      name
      email
      createdAt
    }
  }
`;
