import React from 'react';
import TicketListing from 'src/components/apps/tickets/TicketListing';
import PageContainer from 'src/components/container/PageContainer';
import ChildCard from 'src/components/shared/ChildCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import StatsRequest from './StatsRequests';
import ListingRequests from './ListingRequests';

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
  return (

    <PageContainer>
      <Breadcrumb title="Requests" items={BCrumb} />
      <ChildCard>
        <StatsRequest />
        <ListingRequests />
      </ChildCard>
    </PageContainer>
  )
}
