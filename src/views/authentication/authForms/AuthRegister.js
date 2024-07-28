import {
  useEffect,
  useState
} from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import axios from 'axios';
import { useFormik } from 'formik';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  lastname: Yup.string().required('Last name is required'),
  firstname: Yup.string().required('First name is required'),

  password: Yup.string()
    .required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirmation Password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  Role: Yup.string().required('Role is required'),
  classId: Yup.string().when('Role', {
    is: 'student',
    then: Yup.string().required('Class is required'),
  }),
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
  const user = useAuthUser();
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
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      Role: '',
      classId: ''
    },
    validate,
    onSubmit: async (values) => {
      try {
        const { username, firstname, lastname, email, password, Role, classId, institution } = values;
        const postData = {
          username,
          firstname,
          lastname,
          email,
          password,
          Role: Role,
        };

        const response = await axios.post(`http://localhost:3001/users/signup`, postData);
        console.log('Registration successful2:', response);

        if (Role === 'responsable') {
          const resIns = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
          console.log("🚀 ~ file: AuthRegister.js:88 ~ onSubmit: ~ resIns:", resIns.data);
          const responsableData = {

            user: response.data._id,
            institution: resIns.data.institution,
          };

          await axios.post('http://localhost:3001/userinfos', responsableData);
        }
        if (Role === 'student') {
          const studentData = {
            user: response.data._id,
            classroom: classId,
          };
          await axios.post('http://localhost:3001/userinfos', studentData);

        }
      } catch (error) {
        console.error('Registration error:', error.response.data.message);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message === 'There is already an account with this email.'
        ) {
          setShowAlert(true);
        }
      }
    },


  });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/classrooms');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}
      {subtext}
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Stack mb={6} mx={1}>
            <CustomFormLabel htmlFor="firstname">First Name</CustomFormLabel>
            <CustomTextField
              id="firstname"
              name="firstname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.firstname}
              required
              {...formik.getFieldProps('firstname')}
              sx={{
                '& input:valid + fieldset': {
                  borderColor: '#39cb7f',
                },
                '& input:invalid + fieldset': {
                  borderColor: '#fc4b6c',
                },
              }}
            />

            <CustomFormLabel htmlFor="lastname">Last Name</CustomFormLabel>
            <CustomTextField
              id="lastname"
              name="lastname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.lastname}
              required
              {...formik.getFieldProps('lastname')}
              sx={{
                '& input:valid + fieldset': {
                  borderColor: '#39cb7f',
                },
                '& input:invalid + fieldset': {
                  borderColor: '#fc4b6c',
                },
              }}
            />

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
            <CustomFormLabel htmlFor="Role">Role</CustomFormLabel>
            <CustomTextField
              id="Role"
              name="Role"
              select
              onChange={formik.handleChange}
              value={formik.values.Role}
              required
              sx={{
                '& input:valid + fieldset': {
                  borderColor: '#39cb7f',
                },
                '& input:invalid + fieldset': {
                  borderColor: '#fc4b6c',
                },
              }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="responsable">Responsable</MenuItem>
            </CustomTextField>
            {formik.values.Role === 'student' && (
              <>
                <CustomFormLabel htmlFor="classId">Class</CustomFormLabel>
                <CustomTextField
                  id="classId"
                  name="classId"
                  select
                  onChange={formik.handleChange}
                  value={formik.values.classId}
                  required
                  {...formik.getFieldProps('classId')}
                  sx={{
                    '& input:valid + fieldset': {
                      borderColor: '#39cb7f',
                    },
                    '& input:invalid + fieldset': {
                      borderColor: '#fc4b6c',
                    },
                  }}
                >
                  {/* Populate options from API */}
                  {classes.map((classroom) => (
                    <MenuItem key={classroom._id} value={classroom._id}>
                      {classroom.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </>
            )}
            <Box mt={2}>
              <Button type="submit" color="primary" variant="contained" size="large" fullWidth>
                Sign Up
              </Button>
            </Box>
          </Stack>

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
