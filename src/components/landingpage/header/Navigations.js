import React, { useState } from 'react';
import { Box, Button, Divider, Grid, styled, Paper } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import AppLinks from 'src/layouts/full/vertical/header/AppLinks';
import QuickLinks from 'src/layouts/full/vertical/header/QuickLinks';
import DemosDD from './DemosDD';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import Profile from 'src/layouts/full/vertical/header/Profile';
import { Link } from 'react-router-dom';


const Navigations = () => {
  const StyledButton = styled(Button)(({ theme }) => ({
    fontSize: '16px',
    color: theme.palette.text.secondary,
  }));
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
    {isAuthenticated ? (
      <StyledButton color="inherit" variant="text" href="/admin/dashboard">
        Dashboard
      </StyledButton>): null}
      {isAuthenticated ? (
        <Profile />
      ) : (
        <Button
          color="primary"
          variant="contained"
          to="/auth/login"
          component={Link}
          disableElevation
        >
          Sign In
        </Button>
      )}
    </>
  );
};

export default Navigations;
