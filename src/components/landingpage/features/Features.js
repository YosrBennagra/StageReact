import React from 'react';
import FeaturesTitle from './FeaturesTitle';
import { Typography, Grid, Container, Box } from '@mui/material';
import {
  IconAdjustments,
  IconArchive,
  IconArrowsShuffle,
  IconBook,
  IconBuildingCarousel,
  IconBusinessplan,
  IconCalendar,
  IconChartPie,
  IconDatabase,
  IconDiamond,
  IconFile,
  IconLanguageKatakana,
  IconLayersIntersect,
  IconMessages,
  IconRefresh,
  IconShieldLock,
  IconTag,
  IconUserPlus,
  IconUsers,
  IconWand,
} from '@tabler/icons';
import AnimationFadeIn from '../animation/Animation';

const featuresData = [
  {
    icon: <IconUserPlus width={40} height={40} strokeWidth={1.5} />,
    title: 'Manage Students',
    subtext: 'Create and assign student accounts to classrooms.',
  },
  {
    icon: <IconShieldLock width={40} height={40} strokeWidth={1.5} />,
    title: 'Secure Authentication',
    subtext: 'Your information is protected with robust security measures.',
  },
  {
    icon: <IconUsers width={40} height={40} strokeWidth={1.5} />,
    title: 'Manage Groups',
    subtext: 'Organize and manage groups efficiently.',
  },
  {
    icon: <IconFile width={40} height={40} strokeWidth={1.5} />,
    title: 'Manage Assignments',
    subtext: 'Create assignments and assign them to students.',
  },
  {
    icon: <IconDiamond width={40} height={40} strokeWidth={1.5} />,
    title: 'User Interface',
    subtext: 'Enjoy a friendly and intuitive user interface.',
  },
  {
    icon: <IconBook width={40} height={40} strokeWidth={1.5} />,
    title: 'Lessons',
    subtext: 'Teachers can upload and share their lessons.',
  },
  {
    icon: <IconCalendar width={40} height={40} strokeWidth={1.5} />,
    title: 'Calendar',
    subtext: 'Manage your schedule with our integrated calendar.',
  },
  {
    icon: <IconBusinessplan width={40} height={40} strokeWidth={1.5} />,
    title: 'Salary Monitoring',
    subtext: 'Track and manage teacher salaries.',
  },
];


const Features = () => {
  return (
    <Box py={6}>
      <Container maxWidth="lg">
        <FeaturesTitle />

        <Box mt={6}>
          <Grid container spacing={3}>
            {featuresData.map((feature, index) => (
              <Grid item xs={12} sm={4} lg={3} textAlign="center" key={index}>
                <AnimationFadeIn>
                  <Box color="primary.main">{feature.icon}</Box>
                  <Typography variant="h5" mt={3}>
                    {feature.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" mt={1} mb={3}>
                    {feature.subtext}
                  </Typography>
                </AnimationFadeIn>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
