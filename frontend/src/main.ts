import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

function createApollo(): ApolloClientOptions<any> {
  const httpLink = createHttpLink({
    uri: 'https://comp3133assignment2-production.up.railway.app/graphql',
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
    provideApollo(createApollo), // ✅ this now returns the correct type
  ],
}).catch((err) => console.error(err));
