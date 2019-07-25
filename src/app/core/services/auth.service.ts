import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';
import { map, tap, catchError } from 'rxjs/operators';
import { StorageKeys } from 'src/app/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;
  keepSigned: boolean;
  private _isAuthenticated = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo
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
      tap(res => this.setAuthState({token: res && res.token, isAuthenticated: res !== null})),
      catchError(error => {
        this.setAuthState({token: null, isAuthenticated: false});
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
      tap(res => this.setAuthState({token: res && res.token, isAuthenticated: res !== null})),
      catchError(error => {
        this.setAuthState({token: null, isAuthenticated: false});
        return throwError(error);
      })
    );
  }

  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    window.localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
  }

  private validateToken(): Observable<{ id: string, isAuthenticated: boolean }> {
    return this.apollo.query<LoggedInUserQuery>({
      query: LOGGED_IN_USER_QUERY})
      .pipe(map(res => {
            const user = res.data.loggedInUser;
            return {
              id: user && user.id,
              isAuthenticated: user !== null
            };
          })
        )
  }

  private setAuthState(AuthData: {token: string, isAuthenticated: boolean}): void {
    if (AuthData.isAuthenticated) {
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, AuthData.token);
    }
    this._isAuthenticated.next(AuthData.isAuthenticated);
  }
}