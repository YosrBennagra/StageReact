import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography
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
    title: 'Classrooms',
  },
];

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchClassrooms = async (page, rowsPerPage, search) => {
    try {
      const response = await axios.get(`http://localhost:3001/classrooms`, {
        params: { page, rowsPerPage, search }
      });
      setClassrooms(response.data.classrooms);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  useEffect(() => {
    fetchClassrooms(page, rowsPerPage, search);
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
    <PageContainer title="Classrooms Dashboard">
      <Breadcrumb title="Classrooms Table" items={BCrumb} />
      <TextField
        id="outlined-search"
        placeholder="Search Classrooms"
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
      <ParentCard title="Classrooms List">
        <Paper variant="outlined">
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Classroom Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Groups</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classrooms.map((classroom) => (
                  <TableRow key={classroom._id}>
                    <TableCell>
                      <Typography variant="h6" fontWeight="600">
                        {classroom.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {classroom.groups && classroom.groups.length > 0 ? (
                        classroom.groups.map((group) => (
                          <Box key={group._id}>
                            <Typography variant="body2">
                              Group Name: {group.name}
                            </Typography>
                            {group.subject && (
                              <Typography variant="body2" color="textSecondary">
                                Subject: {group.subject.name}
                              </Typography>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No groups
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
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
