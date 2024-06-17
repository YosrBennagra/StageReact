import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/errorimg.svg';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axios from 'axios';


const VerifyMail = () => {
  const authUser = useAuthUser();
  console.log(authUser);
  const handleResendVerification = async () => {
    try {
      await axios.post('http://localhost:3001/email-confirmation/resend-confirmation-link', {
        email: authUser.email,
      });

      console.log('Verification link resent successfully.');
    } catch (error) {
      console.error('Error resending verification link:', error);
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
          Please Verify Your Email Before 3 Days
        </Typography>
        <Button
          style={{ marginLeft: '10px', marginRight: '10px' }}
          color="primary"
          variant="contained"
          component={Link}
          to="/dashboards/modern"
          disableElevation
        >
          Continue
        </Button>

        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/dashboards/modern"
          disableElevation
          onClick={handleResendVerification}
        >
          Re-send Verification Link
        </Button>
      </Container>
    </Box>
  );
};

export default VerifyMail;
