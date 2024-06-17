import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';


const AuthLogin = ({ title, subtitle, subtext }) => {
  const AlertBox = ({ severity, children }) => {
    return (
      <Box mb={1}>
        <Alert variant="filled" severity={severity}>
          {children}
        </Alert>
      </Box>
    );
  };
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [resState, setResState] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/auth/signin', formData);
      setResState(res.status);
      if (resState === 401) {
        setShowAlert(true);
      }
      if (res.status === 200) {
        const {
          userId,
          access_token,
          useremail,
          username,
          user,
          faSecret,
          isTwoFactorAuthenticationEnabled,
          isEmailConfirmed,
          profilePicture,
          role
        } = res.data;

        if (!isEmailConfirmed) {
          signInUser(
            access_token,
            username,
            useremail,
            userId,
            user,
            faSecret,
            isEmailConfirmed,
            profilePicture,
            role
          );
          navigate('/auth/verify');
        } else if (isTwoFactorAuthenticationEnabled) {
          sessionStorage.setItem(
            'tempAuthData',
            JSON.stringify({
              token: access_token,
              username,
              useremail,
              userId,
              user,
              faSecret,
              isEmailConfirmed,
              profilePicture,
              formData,
              role
            }),
          );
          navigate('/auth/two-steps2');
        } else {
          signInUser(
            access_token,
            username,
            useremail,
            userId,
            user,
            faSecret,
            isEmailConfirmed,
            profilePicture,
            role
          );
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response && error.response.status === 401) {
        setShowAlert(true);
      }
    }
  };

  const signInUser = (
    token,
    username,
    useremail,
    userId,
    user,
    faSecret,
    isEmailConfirmed,
    profilePicture,
    role
  ) => {
    signIn({
      auth: {
        token,
        type: 'Bearer',
      },
      userState: {
        name: username,
        email: useremail,
        fasecret: faSecret,
        userId,
        user,
        is2FaEnabled: false,
        isAccountVerified: isEmailConfirmed,
        profilePicture: profilePicture,
        role
      },
    });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            sign in
          </Typography>
        </Divider>
      </Box>
      <form onSubmit={onSubmit}>
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
            <CustomTextField
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type={'email'}
              id="email"
              variant="outlined"
              fullWidth
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              id="password"
              type={'password'}
              variant="outlined"
              fullWidth
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remeber this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/auth/forgot-password2"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign In
          </Button>
        </Box>
        <Box
          sx={{
            width: 500,
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          {resState === 401 && <AlertBox severity="warning">{resState}</AlertBox>}
          {showAlert && (
            <AlertBox severity="error" onClose={() => setShowAlert(false)}>
              Credantials incorrect
            </AlertBox>
          )}
        </Box>
      </form>
      {subtitle}
    </>
  );
};
export default AuthLogin;
