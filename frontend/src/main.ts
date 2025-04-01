import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { environment } from './environments/environment'; // 👈 import env

function createApollo(): ApolloClientOptions<any> {
  const httpLink = createHttpLink({
    uri: environment.graphqlUri, // 👈 use env var
  });

  const authLink = setContext(() => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return {
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  };
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideApollo(createApollo),
  ],
}).catch((err) => console.error(err));
