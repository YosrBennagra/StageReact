import React from 'react';
import TopCards from 'src/components/dashboards/modern/TopCards';
import icon1 from '../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../assets/images/svgs/icon-speech-bubble.svg';
import { Box, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const topcards = [
  {
    href: '/apps/blog/posts',
    icon: icon3,
    title: 'High Schools',
    digits: '256',
    bgcolor: 'warning',
    roles: ['admin']
  },
  {
    href: '/apps/contacts',
    icon: icon1,
    title: 'Responsables',
    digits: '48',
    bgcolor: 'info',
    roles: ['admin', 'responsable']
  },
  {
    href: '/user-profile',
    icon: icon2,
    title: 'Teachers',
    digits: '3,685',
    bgcolor: 'primary',
    roles: ['admin', 'responsable']
  },
  {
    href: '/dashboard/students',
    icon: icon6,
    title: 'Students',
    digits: '96',
    bgcolor: 'success',
    roles: ['admin', 'responsable', 'teacher']
  },
  {
    href: '/dashboard/assignments',
    icon: icon5,
    title: 'Assignments',
    digits: '$348K',
    bgcolor: 'error',
    roles: ['admin', 'responsable', 'teacher']
  },
  {
    href: '/dashboard/requests',
    icon: icon4,
    title: 'Requests',
    digits: '932',
    bgcolor: 'secondary',
    roles: ['admin', 'teacher']
  },
  {
    href: '/dashboard/requests',
    icon: icon4,
    title: 'Groups',
    digits: '67',
    bgcolor: 'secondary',
    roles: ['admin', 'teacher']
  },
];

export default function DashboardAdmin() {
  const user = useAuthUser();
  console.log(user.role);

  return (
    <Grid container spacing={3} mt={3}>
      {topcards
        .filter(topcard => topcard.roles.includes(user.role))
        .map((topcard, i) => (
          <Grid item xs={12} sm={4} lg={2} key={i}>
            <Link to={topcard.href}>
              <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
                <CardContent>
                  <img src={topcard.icon} alt={topcard.icon} width="50" />
                  <Typography
                    color={topcard.bgcolor + '.main'}
                    mt={1}
                    variant="subtitle1"
                    fontWeight={600}
                  >
                    {topcard.title}
                  </Typography>
                  <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                    {topcard.digits}
                  </Typography>
                </CardContent>
              </Box>
            </Link>
          </Grid>
        ))}
    </Grid>
  );
}
