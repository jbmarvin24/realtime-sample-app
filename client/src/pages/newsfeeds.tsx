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
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import { useRouter } from 'next/router';
import CircleIcon from '@mui/icons-material/Circle';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { IPOST_QUERY, POST_MUTATION, POST_QUERY, POST_SUBSCRIPTION } from '../graphql/Post';
import moment from 'moment';

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [body, setBody] = useState('');
  const open = Boolean(anchorEl);

  useEffect(() => {
    subscribeToNewPost();
  }, []);

  // GraphQL
  // const { data, loading } = useSubscription(POST_SUBSCRIPTION);
  // const { data, loading, error } = useQuery<IPOST_QUERY>(POST_QUERY);
  const [createPost] = useMutation(POST_MUTATION);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreatePost = async () => {
    await createPost({
      variables: {
        username,
        body,
      },
    });
    setBody('');
  };

  // console.log(data?.posts);
  // console.log(body);

  // console.log(subscribeToNewPost);

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            REAL TIME SAMPLE APP
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex' }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit" onClick={handleClick}>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <div style={{ marginLeft: 30, marginRight: 10, margin: 'auto' }}>
              <Typography variant="inherit">{username}</Typography>
            </div>
          </Box>
          {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>

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
              <Grid item>
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
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                    <IconButton aria-label="comment">
                      <CommentIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuList dense>
          <MenuItem>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp">J</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ marginRight: 2 }}
              // primary="Username was liked your post."
              primary={
                <Fragment>
                  <Typography sx={{ display: 'inline', fontWeight: 'bold' }} component="span" variant="body2" color="text.primary">
                    Ali Connors
                  </Typography>
                  {' was liked your post.'}
                </Fragment>
              }
              // secondary={
              //   <Fragment>
              //     <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
              //       Ali Connors
              //     </Typography>
              //     {" — I'll be in your neighborhood doing errands this…"}
              //   </Fragment>
              // }
            >
              Single
            </ListItemText>
            <CircleIcon style={{ color: blue[500], width: 15, height: 15 }} />
          </MenuItem>
          <MenuItem>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp">J</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ marginRight: 2 }}
              primary="Username was liked your post."
              // secondary={
              //   <Fragment>
              //     <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
              //       Ali Connors
              //     </Typography>
              //     {" — I'll be in your neighborhood doing errands this…"}
              //   </Fragment>
              // }
            >
              Single
            </ListItemText>
            <CircleIcon style={{ color: blue[500], width: 15, height: 15 }} />
          </MenuItem>
          <MenuItem>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp">J</Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ marginRight: 2 }}
              primary="Username was comment on your post."
              // secondary={
              //   <Fragment>
              //     <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
              //       Ali Connors
              //     </Typography>
              //     {" — I'll be in your neighborhood doing errands this…"}
              //   </Fragment>
              // }
            >
              Single
            </ListItemText>
            <CircleIcon sx={{ color: blue[500], width: 15, height: 15 }} />
          </MenuItem>
        </MenuList>
      </Menu>
    </Fragment>
  );
};

// export default NewsFeeds;
