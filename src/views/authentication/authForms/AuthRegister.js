import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';
import axios from 'axios';
import { useFormik } from 'formik';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
      'Password must contain at least one (uppercase letter), one (lowercase letter), one (number), one (special character), and be at least (8 characters long)',
    ),
  confirmPassword: Yup.string()
    .required('Confirmation Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
const validate = async (values) => {
  let errors = {};
  try {
    await validationSchema.validate(values, { abortEarly: false });
  } catch (validationErrors) {
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
  }
  return errors;
};

const AuthRegister = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const AlertBox = ({ severity, children }) => {
    return (
      <Box mb={1}>
        <Alert variant="filled" severity={severity}>
          {children}
        </Alert>
      </Box>
    );
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`http://localhost:3001/users/signup`, values);
        console.log('Registration successful:', response);
        await axios.post('http://localhost:3001/email-confirmation/resend-confirmation-link', {
          email: values.email,
        });
        navigate('/auth/login')
      } catch (error) {
        console.error('Registration error:', error.response.data.message);
        console.log('Error response:', error.response.data);
        console.log('Error message:', error.response.data.message);
        console.log('Error error:', error.response);
        if (
          error.response ||
          error.response.data ||
          error.response.data.message === 'There is already an account with this email.'
        ) {
          setShowAlert(true);
        }
      }
    },
  });
  return (
    <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}
    {/* <AuthSocialButtons title="Sign up with" /> */}
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
          sign up
        </Typography>
      </Divider>
    </Box>
    <form onSubmit={formik.handleSubmit}>
      <Box>
        <Stack mb={6}>
          <CustomFormLabel htmlFor="username">User Name</CustomFormLabel>
          <CustomTextField
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
            sx={{
              '& input:valid + fieldset': {
                borderColor: '#39cb7f',
              },
              '& input:invalid + fieldset': {
                borderColor: '#fc4b6c',
              },
            }}
          />

          <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
          <CustomTextField
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            required
            {...formik.getFieldProps('email')}
            sx={{
              '& input:valid + fieldset': {
                borderColor: '#39cb7f',
              },
              '& input:invalid + fieldset': {
                borderColor: '#fc4b6c',
              },
            }}
          />
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            required
            {...formik.getFieldProps('password')}
            sx={{
              '& input:valid + fieldset': {
                borderColor: '#39cb7f',
              },
              '& input:invalid + fieldset': {
                borderColor: '#fc4b6c',
              },
            }}
          />
          <CustomFormLabel htmlFor="confirmPassword">Password Confirmation </CustomFormLabel>
          <CustomTextField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.passwordConfirmation}
            required
            {...formik.getFieldProps('confirmPassword')}
            sx={{
              '& input:valid + fieldset': {
                borderColor: '#39cb7f',
              },
              '& input:invalid + fieldset': {
                borderColor: '#fc4b6c',
              },
            }}
          />
        </Stack>
        <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
          Sign Up
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
        {formik.touched.email && formik.errors.email && (
          <AlertBox severity="warning">{formik.errors.email}</AlertBox>
        )}
        {formik.touched.password && formik.errors.password && (
          <AlertBox severity="warning">{formik.errors.password}</AlertBox>
        )}
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <AlertBox severity="warning">{formik.errors.confirmPassword}</AlertBox>
        )}
        {showAlert && (
          <AlertBox severity="error" onClose={() => setShowAlert(false)}>
            There is already an account with this email.
          </AlertBox>
        )}
      </Box>
      {subtitle}
    </form>
  </>
  );
};

export default AuthRegister;
