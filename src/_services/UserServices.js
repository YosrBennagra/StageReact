import User from 'src/_models/user';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/users';

const populateUser = (isAuthenticated, authUser) => {
  const user = new User();
  if (isAuthenticated && authUser) {
    user.username = capitalizeFirstLetter(authUser.name);
    user.email = capitalizeFirstLetter(authUser.email);
    user.userId = authUser.userId;
    user.fasecret = authUser.fasecret;
    user.is2FaEnabled = authUser.is2FaEnabled;
    user.isEmailConfirmed = authUser.isEmailConfirmed;
  } else {
    user.username = 'Name Placeholder';
    user.email = 'Email Placeholder';
  }
  return user;
};

const capitalizeFirstLetter = (string) => {
  if (typeof string !== 'string' || !string) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getalluser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { populateUser, getalluser };
