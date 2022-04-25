import { Box, Button, Card, CardActions, CardContent, Container, TextField, Typography } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  return (
    <Box sx={{ height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 500 }}>
        <CardContent>
          <Typography variant="h4" component="div" textAlign="center">
            Login
          </Typography>
          <Typography variant="h6" component="div" textAlign="center">
            Realtime sample app
          </Typography>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            fullWidth
            style={{ marginTop: 20 }}
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (username) router.push('/newsfeeds?username=' + username);
              else alert('Username is a required field.');
            }}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Home;
