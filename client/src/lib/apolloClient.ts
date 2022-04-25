import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, NormalizedCacheObject, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useMemo } from 'react';
// import { concatPagination } from '@apollo/client/utilities';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// Subcription
const createWSLink = () => {
  return new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:4000',
    })
  );
};

// log query errors
const errorLink = onError((error) => {
  const { networkError, graphQLErrors } = error;
  if (graphQLErrors) console.log(`[Graphql Error]: ${graphQLErrors}`, graphQLErrors);
  if (networkError && !graphQLErrors) console.log(`[Network error]: ${networkError}`, networkError);
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
  // uri: 'http://192.168.1.112:4001',
  // credentials: 'include',
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link =
  typeof window !== 'undefined' // if Browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
        },
        createWSLink(),
        httpLink
      )
    : httpLink;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([errorLink, link]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // userProducts: concatPagination(),
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: NormalizedCacheObject) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
