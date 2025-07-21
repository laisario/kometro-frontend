import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import Router from './routes/MainRouter.jsx';
import AuthProvider from './auth/provider';
import ThemeProvider from './theme';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import AssetsProvider from './assets/provider/index.jsx';
import ProposalsProvider from './proposals/provider/index.jsx';
import ClientsProvider from './clients/provider/index.jsx';
import DocumentsProvider from './documents/provider/index.jsx';
import MainRouter from './routes/MainRouter.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <HelmetProvider>
      <HashRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
              <AuthProvider>
                <MainRouter />
              </AuthProvider>
            </SnackbarProvider> 
          </QueryClientProvider>
        </ThemeProvider>
      </HashRouter>
    </HelmetProvider>
);
