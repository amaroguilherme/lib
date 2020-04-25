import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AllUsersQuery, ALL_USERS_QUERY, UserQuery, GET_USER_BY_ID_QUERY, NEW_USERS_SUBSCRIPTION, UPDATE_USER_MUTATION, getUpdateUserPhotoMutation } from './user.graphql';
import { map, mergeMap } from 'rxjs/operators';
import { FileService } from './file.service';
import { FileModel } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users$: Observable<User[]>;
  private queryRef: QueryRef<AllUsersQuery>;
  private usersSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private fileService: FileService
  ) { }

  startUsersMonitoring(idToExclude: string): void {
    if (!this.users$) {
      this.users$ = this.allUsers(idToExclude);
      this.usersSubscription = this.users$.subscribe();
    }
  }

  stopUsersMonitoring(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
      this.usersSubscription = null;
      this.users$ = null;
    }
  }

  allUsers(idToExclude: string): Observable<User[]> {
    this.queryRef = this.apollo.watchQuery<AllUsersQuery>({
      query: ALL_USERS_QUERY,
      variables: {
        idToExclude
      },
      fetchPolicy: 'network-only'
    });

    this.queryRef.subscribeToMore({
      document: NEW_USERS_SUBSCRIPTION,
      updateQuery: (previous, { subscriptionData }) => {
        const newUser: User = subscriptionData.data.User.node;

        return {
          ...previous,
          allUsers: ([newUser, ...previous.allUsers]).sort((uA, uB) => {
            if (uA.name < uB.name) { return -1; }
            if (uA.name > uB.name) { return 1; }
            return 0;
          })
        };
      }
    });

    return this.queryRef.valueChanges.pipe(
      map(res => res.data.allUsers)
    );
  }

  getUserById(id: string): Observable<User> {
    return this.apollo.query<UserQuery>({
      query: GET_USER_BY_ID_QUERY,
      variables: { userId: id }
    }).pipe(map(res => res.data.User));
  }

  updateUser(user: User): Observable<User> {
    return this.apollo.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }).pipe(map(res => res.data.updateUser ));
  }

  updateUserPhoto(file: File, user: User): Observable<User> {
    return this.fileService.upload(file).pipe(mergeMap((newPhoto: FileModel) => {
      return this.apollo.mutate({
        mutation: getUpdateUserPhotoMutation(!!user.photo),
        variables: {
          loggedUserId: user.id,
          newPhotoId: newPhoto.id,
          oldPhotoId: (user.photo) ? user.photo.id : null
        }
      }).pipe(map(res => res.data.updateUser))
    }));
  }
}
