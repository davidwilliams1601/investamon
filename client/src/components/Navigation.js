import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import PetsIcon from '@mui/icons-material/Pets';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const NavButton = styled(Button)({
  color: 'white',
  margin: '0 8px',
  borderRadius: '20px',
  padding: '8px 16px',
  transition: 'all 0.2s',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  
  '&.active': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const Logo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: '32px',
});

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Logo>
          <PetsIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h6" component="div">
            InvestiMon
          </Typography>
        </Logo>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <NavButton
            component={RouterLink}
            to="/dashboard"
            startIcon={<DashboardIcon />}
            className={isActive('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </NavButton>
          
          <NavButton
            component={RouterLink}
            to="/characters"
            startIcon={<PetsIcon />}
            className={isActive('/characters') ? 'active' : ''}
          >
            My Monsters
          </NavButton>
          
          <NavButton
            component={RouterLink}
            to="/challenges"
            startIcon={<EmojiEventsIcon />}
            className={isActive('/challenges') ? 'active' : ''}
          >
            Challenges
          </NavButton>
          
          <NavButton
            component={RouterLink}
            to="/news"
            startIcon={<NewspaperIcon />}
            className={isActive('/news') ? 'active' : ''}
          >
            Market News
          </NavButton>
        </Box>

        {user ? (
          <Box sx={{ display: 'flex' }}>
            <NavButton
              component={RouterLink}
              to="/profile"
              startIcon={<AccountCircleIcon />}
              className={isActive('/profile') ? 'active' : ''}
            >
              Profile
            </NavButton>
            <NavButton onClick={handleLogout}>
              Logout
            </NavButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <NavButton
              component={RouterLink}
              to="/login"
              className={isActive('/login') ? 'active' : ''}
            >
              Login
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/register"
              className={isActive('/register') ? 'active' : ''}
            >
              Register
            </NavButton>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navigation; 