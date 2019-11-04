import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, ReplaySubject, throwError, of } from 'rxjs';
import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';
import { map, tap, catchError, mergeMap } from 'rxjs/operators';
import { StorageKeys } from 'src/app/storage-keys';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { ApolloConfigModule } from 'src/app/apollo.config.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser: User;
  redirectUrl: string;
  keepSigned: boolean;
  private _isAuthenticated = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo,
    private apolloConfigModule: ApolloConfigModule,
    private router: Router
  ) {
    this.isAuthenticated.subscribe(is => console.log('AuthState', is));
    this.init();
  }

  init(): void {
    this.keepSigned = JSON.parse(window.localStorage.getItem(StorageKeys.KEEP_SIGNED));
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }
  signinUser(variables: {email: string, password: string}): Observable<{id: string, token: string}>{
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data.authenticateUser),
      tap(res => this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res !== null})),
      catchError(error => {
        this.setAuthState({id: null, token: null, isAuthenticated: false});
        return throwError(error);
      })
    );
  }

  signupUser(variables: {name: string, email: string, password: string}): Observable<{id: string, token: string}>{
    return this.apollo.mutate({
      mutation: SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      map(res => res.data.signupUser),
      tap(res => this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res !== null})),
      catchError(error => {
        this.setAuthState({id: null, token: null, isAuthenticated: false});
        return throwError(error);
      })
    );
  }

  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    window.localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
  }

  logout(): void {
    this.apolloConfigModule.closeWebSocketConnection();
    window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
    window.localStorage.removeItem(StorageKeys.KEEP_SIGNED);
    this.apolloConfigModule.cachePersistor.purge();
    this.keepSigned = false;
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
    this.apollo.getClient().resetStore();
  }
  autoLogin(): Observable<void> {
    if (!this.keepSigned) {
      this._isAuthenticated.next(false);
      window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
      return of();
    }

    return this.validateToken().pipe(tap(authData => {
      const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
      this.setAuthState({id: authData.id, token, isAuthenticated: authData.isAuthenticated}, true);
    }),
    mergeMap(res => of()),
    catchError(error => {
      this.setAuthState({id: null, token: null, isAuthenticated: false});
      return throwError(error);
    })
    );
  }
  private validateToken(): Observable<{ id: string, isAuthenticated: boolean }> {
    return this.apollo.query<LoggedInUserQuery>({
      query: LOGGED_IN_USER_QUERY,
      fetchPolicy: 'network-only'})
      .pipe(map(res => {
            const user = res.data.loggedInUser;
            return {
              id: user && user.id,
              isAuthenticated: user !== null
            };
          })
        )
  }

  private setAuthState(AuthData: {id: string, token: string, isAuthenticated: boolean}, isRefresh: boolean = false): void {
    if (AuthData.isAuthenticated) {
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, AuthData.token);
      this.authUser = { id: AuthData.id };
      if (!isRefresh) {
        this.apolloConfigModule.closeWebSocketConnection();
      }
    }
    this._isAuthenticated.next(AuthData.isAuthenticated);
  }
}
