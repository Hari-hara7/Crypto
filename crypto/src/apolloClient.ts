// src/apolloClient.ts

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000', // Make sure this points to your GraphQL server
  }),
  cache: new InMemoryCache(),
});

export default client;
