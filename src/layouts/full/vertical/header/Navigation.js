import { Button } from '@mui/material'; 
import { Link } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AppDD = () => {
  const user = useAuthUser();
  console.log(user);
  const [ins, setIns] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseUser = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
        setIns(responseUser.data.institution);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Button color="inherit" sx={{ color: (theme) => theme.palette.text.secondary }} variant="text" to="/admin/dashboard" component={Link}>
        My Dashboard
      </Button>
      {
        user.role === 'responsable' ?
          <Button color="inherit" sx={{ color: (theme) => theme.palette.text.secondary }} variant="text" to={`/edit/institution/${user.institution}`} component={Link}>
            My Institution
          </Button>
          : user.role === 'admin' ? <Button color="inherit" sx={{ color: (theme) => theme.palette.text.secondary }} variant="text" to={`/edit/institution/${ins}`} component={Link}>
            My Institution
          </Button>
            : null
      }
    </>
  );
};

export default AppDD;
