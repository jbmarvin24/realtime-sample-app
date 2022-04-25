import { extendType, intArg, nonNull, objectType, stringArg, subscriptionType } from 'nexus';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('username');
    t.nonNull.string('body');
    t.date('createdAt');
    t.date('updatedAt');
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
      },
    });
  },
});

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createPost', {
      type: 'Post',
      args: {
        username: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const createdPost = ctx.db.post.create({
          data: {
            username: args.username,
            body: args.body,
          },
        });

        ctx.pubsub.publish('POST_CREATED', { postCreated: createdPost });

        return createdPost;
      },
    });
  },
});

export const PostSubcription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('postCreated', {
      type: 'Post',
      subscribe(_, __, ctx) {
        const res = ctx.pubsub.asyncIterator(['POST_CREATED']);
        // console.log(res);

        return res;
      },
      resolve(eventData: any) {
        return eventData.postCreated;
      },
    });
  },
});
