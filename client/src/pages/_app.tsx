import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { Container } from '@mui/material';
import { useApollo } from '../lib/apolloClient';
import { ApolloProvider } from '@apollo/client';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(props.pageProps.initialApolloState);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ApolloProvider client={apolloClient}>
          <div
            style={{
              backgroundColor: '#F8F8F8',
            }}
          >
            {/* Layout */}
            <Container style={{ paddingTop: 78, paddingBottom: 40 }}>
              <Component {...pageProps} />
            </Container>
          </div>
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
