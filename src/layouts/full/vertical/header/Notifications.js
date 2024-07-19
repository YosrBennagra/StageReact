import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';

import { IconBellRinging, IconPlus } from '@tabler/icons';
import { Stack } from '@mui/system';
import AuthRegister from 'src/views/authentication/authForms/AuthRegister';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Notifications = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const user = useAuthUser();
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const navigate = useNavigate();
  const handleNav = () => {
    navigate('/add-account');
  }
  return (
    <Box>
      {user.role === 'admin' || user.role === 'responsable' ? (<Button onClick={handleNav}>Add account</Button>
      ) :
        (<></>)
      }

      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Stack direction="row" py={2} px={4} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Create An Account</Typography>
        </Stack>
        <Scrollbar sx={{ height: '385px' }}>
          <AuthRegister />
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Notifications;
