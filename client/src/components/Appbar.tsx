import { AppBar, Avatar, Badge, Box, IconButton, ListItemAvatar, ListItemText, Menu, MenuItem, MenuList, Toolbar, Typography } from '@mui/material';
import { NextPage } from 'next';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CircleIcon from '@mui/icons-material/Circle';
import { blue } from '@mui/material/colors';
import { useQuery } from '@apollo/client';
import { NOTIFICATION_MY_UNREAD_QUERY, NOTIFICATION_SUBCRIPTION } from '../graphql/Notification';

export default function AppBarWithData() {
  const router = useRouter();
  const { subscribeToMore, ...result } = useQuery(NOTIFICATION_MY_UNREAD_QUERY, {
    variables: {
      username: router.query.username,
    },
  });

  //   console.log(router.query.username);

  return (
    <ApplicationBar
      {...result}
      subscribeToNewPost={() =>
        subscribeToMore({
          document: NOTIFICATION_SUBCRIPTION,
          variables: { currentUsername: router.query.username },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const notificationItem = subscriptionData.data.notificationCreated;

            return Object.assign({}, prev, {
              myUnreadNotifications: [notificationItem, ...prev.myUnreadNotifications],
            });
          },
        })
      }
      username={router.query.username as any}
    />
  );
}

interface IApplicationBarProps {
  data: any;
  subscribeToNewPost: () => void;
  username: string;
}

const ApplicationBar: NextPage<IApplicationBarProps> = ({ data, subscribeToNewPost, username }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    subscribeToNewPost();
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   console.log(data);

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
              <Badge badgeContent={data ? data.myUnreadNotifications.length : 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <div style={{ marginLeft: 30, marginRight: 10, margin: 'auto' }}>
              <Typography variant="inherit">{username}</Typography>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
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
          {data &&
            data.myUnreadNotifications.map((x: any, i: number) => (
              <MenuItem key={i}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp">{x.fromUsername[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ marginRight: 2 }}
                  // primary="Username was liked your post."
                  primary={
                    <Fragment>
                      <Typography sx={{ display: 'inline', fontWeight: 'bold' }} component="span" variant="body2" color="text.primary">
                        {x.fromUsername}
                      </Typography>
                      {' ' + x.message}
                    </Fragment>
                  }
                >
                  Single
                </ListItemText>
                <CircleIcon style={{ color: blue[500], width: 15, height: 15 }} />
              </MenuItem>
            ))}
          {/* <MenuItem>
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
            <ListItemText sx={{ marginRight: 2 }} primary="Username was comment on your post.">
              Single
            </ListItemText>
            <CircleIcon sx={{ color: blue[500], width: 15, height: 15 }} />
          </MenuItem> */}
        </MenuList>
      </Menu>
    </Fragment>
  );
};
