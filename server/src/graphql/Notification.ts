import { withFilter } from 'graphql-subscriptions';
import { enumType, extendType, intArg, nonNull, objectType, stringArg } from 'nexus';

export const Notification = objectType({
  name: 'Notification',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('postId');
    t.field('post', {
      type: 'Post',
      async resolve(root, _args, ctx) {
        return ctx.db.notification
          .findUnique({
            where: {
              id: root.id || 0,
            },
          })
          .post();
      },
    });
    t.nonNull.string('postOwnerUsername');
    t.nonNull.string('fromUsername');
    t.nonNull.boolean('isRead');
    t.nonNull.string('message');

    t.date('createdAt');
    t.date('updatedAt');
  },
});

export const NotificationQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('notifications', {
      type: 'Notification',
      resolve(_root, _args, ctx) {
        return ctx.db.notification.findMany();
      },
    });
    t.list.field('myUnreadNotifications', {
      type: 'Notification',
      args: {
        username: nonNull(stringArg()),
      },
      resolve(_, args, ctx) {
        return ctx.db.notification.findMany({
          where: {
            postOwnerUsername: args.username,
            isRead: false,
          },
        });
      },
    });
  },
});

const MessageType = enumType({
  name: 'MessageType',
  members: ['Like', 'Comment'],
});

export const NotificationMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('notificationCreate', {
      type: 'Notification',
      args: {
        postId: nonNull(intArg()),
        postOwnerUsername: nonNull(stringArg()),
        fromUsername: nonNull(stringArg()),
        type: nonNull(MessageType),
      },
      async resolve(_, args, ctx) {
        const createdNotif = await ctx.db.notification.create({
          data: {
            postId: args.postId,
            postOwnerUsername: args.postOwnerUsername,
            fromUsername: args.fromUsername,
            isRead: false,
            message: args.type === 'Like' ? `${args.fromUsername} was liked your post.` : `${args.fromUsername} was comment on your post.`,
          },
        });

        ctx.pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: createdNotif });

        return createdNotif;
      },
    });
    t.nonNull.field('notificationRead', {
      type: 'Notification',
      args: {
        notificationId: nonNull(intArg()),
      },
      resolve(_, args, ctx) {
        return ctx.db.notification.update({
          data: {
            isRead: true,
          },
          where: {
            id: args.notificationId,
          },
        });
      },
    });
  },
});

export const NotificaitonSubscription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('notificationCreated', {
      type: 'Notification',
      args: {
        currentUsername: nonNull(stringArg()),
      },
      subscribe: withFilter(
        (_, __, ctx) => ctx.pubsub.asyncIterator('NOTIFICATION_CREATED'),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          // console.log(payload);

          return payload.notificationCreated.postOwnerUsername === variables.currentUsername;
        }
      ),
      resolve(eventData: any) {
        return eventData.notificationCreated;
      },
    });
  },
});
