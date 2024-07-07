import React from 'react';
import TicketListing from 'src/components/apps/tickets/TicketListing';
import PageContainer from 'src/components/container/PageContainer';
import ChildCard from 'src/components/shared/ChildCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import StatsRequest from './StatsRequests';
import ListingRequests from './ListingRequests';
import { useDispatch, useSelector } from 'react-redux';
import { acceptUser, fetchUsers } from 'src/store/apps/users/usersSlice';
import { Button, Typography } from '@mui/material';

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

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const users = useSelector((state) => state.users.users);
  const NotConfirmedUsers = users.filter(user => user.status === 'NOT CONFIRMED');
  const handleAccept = (user) => {
    dispatch(acceptUser(user));
  };

  return (
    <>
      <PageContainer>
        <Breadcrumb title="Requests" items={BCrumb} />
        <ChildCard>
          {
            NotConfirmedUsers.map((user, index) => (
              <>
                <Typography>{user.username}</Typography>
                <Button onClick={() => handleAccept(user)}>Accept</Button>
              </>
            ))
          }
        </ChildCard>
      </PageContainer>
    </>
    /*     <PageContainer>
          <Breadcrumb title="Requests" items={BCrumb} />
          <ChildCard>
            <StatsRequest />
            <ListingRequests />
          </ChildCard>
        </PageContainer> */
  );
}
