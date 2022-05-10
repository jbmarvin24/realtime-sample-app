import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { blue, red } from '@mui/material/colors';
import { NextPage } from 'next';
import { Fragment, useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { IPOST_QUERY, POST_MUTATION, POST_QUERY, POST_SUBSCRIPTION } from '../graphql/Post';
import moment from 'moment';
import ApplicationBar from '../components/Appbar';
import { NOTIFICATION_CREATE_MUTATION } from '../graphql/Notification';

interface NewsFeedsProps {
  data: any;
  subscribeToNewPost: () => void;
  username: string;
}

export default function PostPageWithData() {
  const router = useRouter();
  const { subscribeToMore, ...result } = useQuery(POST_QUERY);

  return (
    <NewsFeeds
      {...result}
      subscribeToNewPost={() =>
        subscribeToMore({
          document: POST_SUBSCRIPTION,
          // variables: { postID: params.postID },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newFeedItem = subscriptionData.data.postCreated;

            return Object.assign({}, prev, {
              posts: [newFeedItem, ...prev.posts],
            });
          },
        })
      }
      username={router.query.username as any}
    />
  );
}

const NewsFeeds: NextPage<NewsFeedsProps> = ({ data, subscribeToNewPost, username }) => {
  const [body, setBody] = useState('');

  useEffect(() => {
    subscribeToNewPost();
  }, []);

  // GraphQL
  const [createPost] = useMutation(POST_MUTATION);
  const [createNotification] = useMutation(NOTIFICATION_CREATE_MUTATION);

  const handleCreatePost = async () => {
    await createPost({
      variables: {
        username,
        body,
      },
    });
    setBody('');
  };

  const handleCrateNotification = async (postId: number, postOwnerUsername: string, type: 'Like' | 'Comment') => {
    await createNotification({
      variables: {
        postId,
        postOwnerUsername,
        fromUsername: username,
        type,
      },
    });
  };

  return (
    <Fragment>
      <ApplicationBar />
      {/* News Feed */}

      <Container maxWidth="xs">
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ marginBottom: 10 }}>
            <Typography variant="h3" align="center">
              News Feed
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label={`What's on your mind, ${username}?`}
              multiline
              rows={4}
              fullWidth
              onChange={(e) => {
                setBody(e.target.value);
              }}
              value={body}
            />
          </Grid>
          <Grid container item justifyContent="flex-end" style={{ marginBottom: 10 }}>
            <Button variant="contained" fullWidth onClick={handleCreatePost}>
              Post
            </Button>
          </Grid>
          {/* {loading && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Loading...</Typography>
            </Grid>
          )} */}
          {data &&
            data.posts.map((x: any, i: number) => (
              <Grid item key={i}>
                <Card sx={{ width: 400, maxWidth: 400 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {x.username[0]}
                      </Avatar>
                    }
                    // action={
                    //   <IconButton aria-label="settings">
                    //     <MoreVertIcon />
                    //   </IconButton>
                    // }
                    title={x.username}
                    subheader={moment(x.createdAt).format('MMMM DD, YYYY h:mm:ss a')}
                  />
                  <CardMedia component="img" height="194" image={`https://picsum.photos/500?random=${i + 1}`} alt="Post Image" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {x.body}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="like" onClick={() => handleCrateNotification(x.id, x.username, 'Like')}>
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="comment" onClick={() => handleCrateNotification(x.id, x.username, 'Comment')}>
                      <CommentIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </Fragment>
  );
};

// export default NewsFeeds;
