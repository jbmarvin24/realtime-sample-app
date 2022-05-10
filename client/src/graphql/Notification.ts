import { gql } from '@apollo/client';

export interface INOTIFICATION_CREATE_MUTATION_DATA {
  notificationCreate: {
    id: number;
    postId: number;
    postOwnerUsername: string;
    fromUsername: string;
    isRead: boolean;
    message: string;
    createdAt: string;
  };
}

export interface INOTIFICATION_CREATE_MUTATION_VAR {
  postId: number;
  postOwnerUsername: string;
  fromUsername: string;
  type: 'Like' | 'Comment';
}

export const NOTIFICATION_CREATE_MUTATION = gql`
  mutation NotificationCreate($postId: Int!, $postOwnerUsername: String!, $fromUsername: String!, $type: MessageType!) {
    notificationCreate(postId: $postId, postOwnerUsername: $postOwnerUsername, fromUsername: $fromUsername, type: $type) {
      id
      postId
      postOwnerUsername
      fromUsername
      isRead
      message
      createdAt
    }
  }
`;

export const NOTIFICATION_MY_UNREAD_QUERY = gql`
  query MyUnreadNotifications($username: String!) {
    myUnreadNotifications(username: $username) {
      id
      postId
      postOwnerUsername
      fromUsername
      isRead
      message
      createdAt
      updatedAt
    }
  }
`;

export const NOTIFICATION_SUBCRIPTION = gql`
  subscription NotifSub($currentUsername: String!) {
    notificationCreated(currentUsername: $currentUsername) {
      id
      postId
      postOwnerUsername
      fromUsername
      isRead
      message
      createdAt
    }
  }
`;
