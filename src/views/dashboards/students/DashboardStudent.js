import React, { useEffect } from 'react';
import {
  Avatar, AvatarGroup, Box, Chip, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography
} from '@mui/material';
import { IconSearch } from '@tabler/icons';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    to: '/',
    title: 'Dashboard',
  },
  {
    title: 'Students',
  },
];

export default function DashboardStudent() {
  const [students, setStudents] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [totalCount, setTotalCount] = React.useState(0);

  const fetchStudents = async (page, rowsPerPage, search) => {
    try {
      const response = await axios.get('http://localhost:3001/users/role/student', {
        params: {
          search: search,
          limit: rowsPerPage,
          offset: page * rowsPerPage
        }
      });
      setStudents(response.data.users);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error('Error fetching Students:', error);
    }
  };

  useEffect(() => {
    fetchStudents(page, rowsPerPage, search);
  }, [page, rowsPerPage, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); 
  };

  return (
    <PageContainer title="Students Dashboard">
      <Breadcrumb title="student Table" items={BCrumb} />
      <TextField
        id="outlined-search"
        placeholder="Search Students"
        size="small"
        type="search"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size="14" />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      <ParentCard title="Students List">
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Users</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Full Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Groups</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Avatar src={student.imgsrc} alt={student.imgsrc} width="35" />
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {student.username}
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle2">
                            {student.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {student.firstname} {student.lastname}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <AvatarGroup max={4}>
                        </AvatarGroup>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        sx={{
                          bgcolor:
                            student.status === 'CONFIRMED'
                              ? (theme) => theme.palette.success.light
                              : student.status === 'NOT CONFIRMED'
                                ? (theme) => theme.palette.error.light
                                : student.status === 'Completed'
                                  ? (theme) => theme.palette.primary.light
                                  : student.status === 'Cancel'
                                    ? (theme) => theme.palette.error.light
                                    : (theme) => theme.palette.secondary.light,
                          color:
                            student.status === 'CONFIRMED'
                              ? (theme) => theme.palette.success.main
                              : student.status === 'NOT CONFIRMED'
                                ? (theme) => theme.palette.error.main
                                : student.status === 'Completed'
                                  ? (theme) => theme.palette.primary.main
                                  : student.status === 'Cancel'
                                    ? (theme) => theme.palette.error.main
                                    : (theme) => theme.palette.secondary.main,
                          borderRadius: "8px"
                        }}
                        size="small"
                        label={student.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={6}
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
}
