import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import Router from './routes.jsx';
import AuthProvider from './auth/provider';
import ThemeProvider from './theme';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import AssetsProvider from './assets/provider/index.jsx';
import ProposalsProvider from './proposals/provider/index.jsx';
import ClientsProvider from './clients/provider/index.jsx';


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3}>
              <AuthProvider>
                <ClientsProvider>
                  <ProposalsProvider>
                    <AssetsProvider>
                      <Router />
                    </AssetsProvider>
                  </ProposalsProvider>
                </ClientsProvider>
              </AuthProvider>
            </SnackbarProvider> 
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  // </StrictMode>
);
