import React from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, Grid, Typography } from '@mui/material';
import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';


const topcards = [
  {
    href: '/apps/blog/posts',
    icon: icon3,
    title: 'High Schools',
    digits: '256',
    bgcolor: 'warning',
  },
  {
    href: '/apps/contacts',
    icon: icon1,
    title: 'Responsables',
    digits: '48',
    bgcolor: 'info',
  },
  {
    href: '/user-profile',
    icon: icon2,
    title: 'Teachers',
    digits: '3,685',
    bgcolor: 'primary',
  },
  {
    href: '/apps/chats',
    icon: icon6,
    title: 'Students',
    digits: '96',
    bgcolor: 'success',
  },
  {
    href: '/dashboard/assignments',
    icon: icon5,
    title: 'Assigments',
    digits: '$348K',
    bgcolor: 'error',
  },
  {
    href: '/dashboard/requests',
    icon: icon4,
    title: 'Requests',
    digits: '932',
    bgcolor: 'secondary',
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={3} mt={3}>
      {topcards.map((topcard, i) => (
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
};

export default TopCards;
