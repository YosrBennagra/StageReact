import { Box, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers } from 'src/store/apps/users/usersSlice';
import icon3 from '../../assets/images/svgs/icon-briefcase.svg';
import icon1 from '../../assets/images/svgs/icon-connect.svg';
import icon5 from '../../assets/images/svgs/icon-favorites.svg';
import iconGroup from '../../assets/images/svgs/icon-group.svg';
import icon4 from '../../assets/images/svgs/icon-mailbox.svg';
import icon6 from '../../assets/images/svgs/icon-speech-bubble.svg';
import icon2 from '../../assets/images/svgs/icon-user-male.svg';

export default function DashboardAdmin() {
  const user = useAuthUser();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [notConfirmedUsers, setNotConfirmedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    institutions: 0,
    groups: 0,
    classrooms: 0,
    responsables: 0,
    teachers: 0,
    students: 0,
    assignments: 0,
    requests: 0,
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setNotConfirmedUsers(users.filter((user) => user.status === 'NOT CONFIRMED'));
  }, [users]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          'http://localhost:3001/institutions',
          'http://localhost:3001/groups',
          'http://localhost:3001/classrooms',
          'http://localhost:3001/users/role/responsable',
          'http://localhost:3001/users/role/teacher',
          'http://localhost:3001/users/role/student',
          'http://localhost:3001/assignments',
        ];

        const requests = endpoints.map((endpoint) => axios.get(endpoint));

        const responses = await Promise.all(requests);

        const newCounts = {
          institutions: responses[0].data.length,
          groups: responses[1].data.length,
          classrooms: responses[2].data.length,
          responsables: responses[3].data.count,
          teachers: responses[4].data.count,
          students: responses[5].data.count,
          assignments: responses[6].data.length,
          requests: notConfirmedUsers.length,
        };

        setCounts(newCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [notConfirmedUsers.length]);

  const topcards = [
    {
      href: '/dashboard/institutions',
      icon: icon3,
      title: 'Institutions',
      digits: counts.institutions,
      bgcolor: 'warning',
      roles: ['admin'],
    },
    {
      href: '/responsables',
      icon: icon1,
      title: 'Responsables',
      digits: counts.responsables,
      bgcolor: 'info',
      roles: ['admin', 'responsable'],
    },
    {
      href: '/teachers',
      icon: icon2,
      title: 'Teachers',
      digits: counts.teachers,
      bgcolor: 'primary',
      roles: ['admin', 'responsable'],
    },
    {
      href: '/dashboard/students',
      icon: icon6,
      title: 'Students',
      digits: counts.students,
      bgcolor: 'success',
      roles: ['admin', 'responsable', 'teacher'],
    },
    {
      href: '/dashboard/assignments',
      icon: icon5,
      title: 'Assignments',
      digits: counts.assignments,
      bgcolor: 'error',
      roles: ['admin', 'responsable', 'teacher'],
    },
    {
      href: '/dashboard/requests',
      icon: icon4,
      title: 'Requests',
      digits: counts.requests,
      bgcolor: 'secondary',
      roles: ['admin', 'teacher'],
    },
    {
      href: '/dashboard/groups',
      icon: iconGroup,
      title: 'Groups',
      digits: counts.groups,
      bgcolor: 'secondary',
      roles: ['admin', 'teacher', 'student'],
    },
    {
      href: '/dashboard/classes',
      icon: iconGroup,
      title: 'Classes',
      digits: counts.classrooms,
      bgcolor: 'secondary',
      roles: ['admin'],
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} mt={3}>
      {topcards
        .filter((topcard) => topcard.roles.includes(user.role))
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
