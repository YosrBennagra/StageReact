import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { acceptUser, fetchUsers } from 'src/store/apps/users/usersSlice';
import PageContainer from 'src/components/container/PageContainer';
import ChildCard from 'src/components/shared/ChildCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

export default function DashboardRequests() {
  const BCrumb = [
    {
      to: '/',
      title: 'Dashboard',
    },
    {
      title: 'Requests',
    },
  ];

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [notConfirmedUsers, setNotConfirmedUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setNotConfirmedUsers(users.filter(user => user.status === 'NOT CONFIRMED'));
  }, [users]);

  const handleAccept = (user) => {
    dispatch(acceptUser(user)).then(() => {
      setNotConfirmedUsers(notConfirmedUsers.filter(u => u._id !== user._id));
    });
  };

  return (
    <>
      <PageContainer>
        <Breadcrumb title="Requests" items={BCrumb} />
        <ChildCard>
          {notConfirmedUsers.map((user) => (
            <Box key={user._id} display={'flex'} justifyContent={'space-between'} marginY={1}>
              <Typography>{user.username}</Typography>
              <Typography>{user.firstname}</Typography>
              <Typography>{user.lastname}</Typography>
              <Typography>{user.email}</Typography>
              <Typography>{user.status}</Typography>
              <Button onClick={() => handleAccept(user)}>Accept</Button>
            </Box>
          ))}
        </ChildCard>
      </PageContainer>
    </>
  );
}
