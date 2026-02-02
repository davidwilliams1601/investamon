import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import { ThemeProvider, styled } from '@mui/material/styles';
import Navigation from './Navigation';
import theme from '../styles/theme';

const MainContent = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: theme.palette.background.default,
  padding: '24px 0',
}));

const PageContainer = styled(Container)({
  maxWidth: '1200px',
  margin: '0 auto',
});

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navigation />
        <MainContent>
          <PageContainer>
            {children}
          </PageContainer>
        </MainContent>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 