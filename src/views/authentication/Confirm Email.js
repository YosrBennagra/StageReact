import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/errorimg.svg';
import axios from 'axios';
import { populateUser } from 'src/_services/UserServices';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Link } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


const ClickToVerify = () => {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const user = populateUser(isAuthenticated, authUser);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  console.log('token:', token);
  const handleResendVerification = async (token) => {
    try {
      const response = await axios.post('http://localhost:3001/email-confirmation/confirm', {
        token: token,
      });
      console.log('Verification successful:', response);
    } catch (error) {
      console.error('Error confirming email:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <img src={ErrorImg} alt="404" />
        <Typography align="center" variant="h1" mb={4}>
          Opps!!!
        </Typography>
        <Typography align="center" variant="h4" mb={4}>
          Click On The Button Below To Confirm the Email
        </Typography>
        <Button
          onClick={() => handleResendVerification(token)}
          color="primary"
          variant="contained"
          component={Link}
          to="/dashboards/modern"
          disableElevation
        >
          Confirm Email
        </Button>
      </Container>
    </Box>
  );
};

export default ClickToVerify;
