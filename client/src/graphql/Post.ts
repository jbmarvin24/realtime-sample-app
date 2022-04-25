import { gql } from '@apollo/client';

export interface IPOST_QUERY {
  posts: {
    id: string;
    username: string;
    body: string;
    createdAt: string;
  }[];
}

export const POST_QUERY = gql`
  query Posts {
    posts {
      id
      username
      body
      createdAt
    }
  }
`;

export interface IPOST_SUBSCRIPTION {
  postCreated: {
    id: number;
    username: string;
    body: string;
    createdAt: string;
  };
}

export const POST_SUBSCRIPTION = gql`
  subscription Subscription {
    postCreated {
      id
      username
      body
      createdAt
    }
  }
`;

export interface IPOST_MUTATION {
  createPost: {
    id: string;
    username: string;
    body: string;
    createdAt: string;
  };
}

export const POST_MUTATION = gql`
  mutation CreatePost($username: String!, $body: String!) {
    createPost(username: $username, body: $body) {
      id
      username
      body
      createdAt
    }
  }
`;
