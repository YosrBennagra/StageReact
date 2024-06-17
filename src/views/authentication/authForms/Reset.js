import React from 'react';
import { Alert, Box, Typography, Button, Stack, Divider } from '@mui/material';
import { useFormik } from 'formik';
import axios from 'axios';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .required('Confirmation Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Reset = ({ title, subtitle, subtext }) => {
  const [showAlert, setShowAlert] = React.useState(false);
  const AlertBox = ({ severity, children }) => {
    return (
      <Box mb={1}>
        <Alert variant="filled" severity={severity}>
          {children}
        </Alert>
      </Box>
    );
  };
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Submitting form...');

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        const res = await axios.post('http://localhost:3001/users/reset-password', {
          email,
          resetToken: token,
          password: values.password,
        });

        console.log('res:', res);
        navigate('/auth/login2');
      } catch (error) {
        console.error('Reset Password Error:', error);
      }
    },
  });

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

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
            Reset Your Password
          </Typography>
        </Divider>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Stack>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField
              id="password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('password')}
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="passwordConfirmation">Password Confirmation</CustomFormLabel>
            <CustomTextField
              id="passwordConfirmation"
              type="password"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('passwordConfirmation')}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}></Stack>
        </Stack>
        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Confirm Password
          </Button>
        </Box>
      </form>
      <Box
        sx={{
          width: 500,
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        {formik.touched.password && formik.errors.password && (
          <AlertBox severity="warning">{formik.errors.password}</AlertBox>
        )}
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
          <AlertBox severity="warning">{formik.errors.passwordConfirmation}</AlertBox>
        )}
        {showAlert && (
          <AlertBox severity="error" onClose={() => setShowAlert(false)}>
            There is already an account with this email.
          </AlertBox>
        )}
      </Box>
      {subtitle}
    </>
  );
};
export default Reset;
