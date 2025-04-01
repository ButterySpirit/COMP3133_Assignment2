import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  signup(username: string, email: string, password: string) {
    const SIGNUP_MUTATION = gql`
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          email
          username
        }
      }
    `;

    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { username, email, password }
    }).pipe(
      map((result: any) => {
        const user = result.data.signup;
        if (user.token) {
          localStorage.setItem('token', user.token); // ✅ Save token
        }
        return user;
      })
    );
  }

  login(email: string, password: string) {
    const LOGIN_QUERY = gql`
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          email
          username
        }
      }
    `;

    return this.apollo.query({
      query: LOGIN_QUERY,
      variables: { email, password },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((result: any) => {
        const user = result.data.login;
        if (user.token) {
          localStorage.setItem('token', user.token); // ✅ Save token
        }
        return user;
      })
    );
  }
}
