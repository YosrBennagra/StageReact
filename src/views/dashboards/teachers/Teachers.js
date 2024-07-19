import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Chip, Icon, IconButton, InputAdornment, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography
} from '@mui/material';
import { IconMinus, IconPlus, IconSearch } from '@tabler/icons';
import axios from 'axios';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    title: 'Dashboard',
  },
  {
    title: 'Teachers',
  },
];

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalSalaryAmount, setTotalSalaryAmount] = useState(0);

  const fetchTeachers = async (page, rowsPerPage, search) => {
    try {
      const response = await axios.get('http://localhost:3001/users/role/teacher', {
        params: {
          search: search,
          limit: rowsPerPage,
          offset: page * rowsPerPage
        }
      });

      const salaryResponse = await axios.get('http://localhost:3001/salary');
      const salaryData = salaryResponse.data;

      const fetchedTeachers = response.data.users.map(teacher => {
        const matchedSalary = salaryData.find(salary => salary.TeacherId === teacher._id);
        const hours = matchedSalary ? matchedSalary.hours : 0;
        const salaryPerHour = matchedSalary ? matchedSalary.salaryPerHour : 0;
        const salaryAmount = matchedSalary ? matchedSalary.salary : 0;
        const salaryType = matchedSalary ? matchedSalary.salaryType : 'Hourly';
        return {
          ...teacher,
          hours: hours,
          salaryPerHour: salaryPerHour,
          salaryAmount: salaryAmount,
          salaryType: salaryType,
        };
      });

      setTeachers(fetchedTeachers);
      setTotalCount(response.data.count);

      // Calculate total salary amount
      const totalSalary = fetchedTeachers.reduce((total, teacher) => {
        return total + (teacher.salaryType ? (teacher.salaryPerHour * teacher.hours) : teacher.salaryAmount);
      }, 0);
      setTotalSalaryAmount(totalSalary);
    } catch (error) {
      console.error('Error fetching Teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers(page, rowsPerPage, search);
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

  const handleWorkHoursChange = async (teacherId, newWorkHours) => {
    try {
      await axios.put(`http://localhost:3001/salary/${teacherId}`, { hours: newWorkHours });

      const updatedTeachers = teachers.map(teacher => {
        if (teacher._id === teacherId) {
          return { ...teacher, hours: newWorkHours };
        }
        return teacher;
      });
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating work hours:', error);
    }
  };

  const handlePayPerHourChange = async (teacherId, newPayPerHour) => {
    try {
      await axios.put(`http://localhost:3001/salary/${teacherId}`, { salaryPerHour: newPayPerHour });

      const updatedTeachers = teachers.map(teacher => {
        if (teacher._id === teacherId) {
          return { ...teacher, salaryPerHour: newPayPerHour };
        }
        return teacher;
      });
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating pay per hour:', error);
    }
  };

  const handleSalaryAmountChange = async (teacherId, newSalaryAmount) => {
    try {
      await axios.put(`http://localhost:3001/salary/${teacherId}`, { salary: newSalaryAmount });

      const updatedTeachers = teachers.map(teacher => {
        if (teacher._id === teacherId) {
          return { ...teacher, salaryAmount: newSalaryAmount };
        }
        return teacher;
      });
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating salary amount:', error);
    }
  };

  const handleSalaryTypeChange = async (teacherId, newSalaryType) => {
    try {
      await axios.put(`http://localhost:3001/salary/${teacherId}`, { salaryType: newSalaryType });

      const updatedTeachers = teachers.map(teacher => {
        if (teacher._id === teacherId) {
          return { ...teacher, salaryType: newSalaryType };
        }
        return teacher;
      });
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error updating salary type:', error);
    }
  };

  const incrementWorkHours = (teacherId, currentWorkHours) => {
    const newWorkHours = currentWorkHours + 1; // Increment work hours
    handleWorkHoursChange(teacherId, newWorkHours);
  };

  const decrementWorkHours = (teacherId, currentWorkHours) => {
    if (currentWorkHours > 0) {
      const newWorkHours = currentWorkHours - 1; // Decrement work hours
      handleWorkHoursChange(teacherId, newWorkHours);
    }
  };

  return (
    <PageContainer title="Teachers Dashboard">
      <Breadcrumb title="Teachers table" items={BCrumb} />
      <TextField
        id="outlined-search"
        placeholder="Search Teachers"
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
        sx={{ mb: 2 }}
      />
      <ParentCard title="Teachers List">
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }} >
              <TableHead >
                <TableRow>
                  <TableCell >
                    <Typography variant="h6">Users</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Full Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Work Hours</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Pay Per Hour</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Salary Type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Salary Amount</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Avatar src={teacher.imgsrc} alt={teacher.imgsrc} width="35" />
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {teacher.username}
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle2">
                            {teacher.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {teacher.firstname} {teacher.lastname}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems={'center'}>
                        <IconButton onClick={() => decrementWorkHours(teacher._id, teacher.hours)}>
                          <IconMinus></IconMinus>
                        </IconButton>
                        <Typography variant="h6">{teacher.hours}</Typography>
                        <IconButton>
                          <IconPlus onClick={() => incrementWorkHours(teacher._id, teacher.hours)}></IconPlus>
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={teacher.salaryPerHour}
                        onChange={(e) => handlePayPerHourChange(teacher._id, e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={teacher.salaryType}
                        onChange={(e) => handleSalaryTypeChange(teacher._id, e.target.value)}
                        fullWidth
                      >
                        <MenuItem value={true}>Hourly</MenuItem>
                        <MenuItem value={false}>Monthly</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {teacher.salaryType === true ? (
                        <Typography variant="h6">{teacher.salaryPerHour * teacher.hours}</Typography>
                      ) : (
                        <TextField
                          type="number"
                          value={teacher.salaryAmount}
                          onChange={(e) => handleSalaryAmountChange(teacher._id, parseFloat(e.target.value))}
                          fullWidth
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    <Typography variant="h6">Total Salary Amount:</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">{totalSalaryAmount}</Typography>
                  </TableCell>
                </TableRow>
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
