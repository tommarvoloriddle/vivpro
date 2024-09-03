// Header.js
import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styled from '@mui/material/styles/styled';

const HeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
}));

const HeaderComponent = () => (
  <HeaderWrapper>
    <Logo>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" sx={{ my: 4, fontWeight: 'bold', color: 'black' }}>
          📊 Vivpro
        </Typography>
      </Box>
    </Logo>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton>
        <NotificationsIcon />
      </IconButton>
      <Avatar sx={{ ml: 2 }} />
    </Box>
  </HeaderWrapper>
);

export default HeaderComponent;
