import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  AvatarGroup,
  Chip,
  Paper,
  TableContainer,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import { IconSearch } from '@tabler/icons';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Assignments',
  },
];

export default function DashboardAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/assignments');
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer title="Assignments" description="This is the Assignments page">
      {/* breadcrumb */}
      <Breadcrumb title="Assignments" items={BCrumb} />
      {/* end breadcrumb */}
      <TextField
        id="outlined-search"
        placeholder="Search Assignments"
        size="small"
        type="search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size="14" />
            </InputAdornment>
          ),
        }}
        fullWidth
      />
      <ParentCard title="Assignments Table">
        <Paper variant="outlined">
          <TableContainer>
            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Assignment Title</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Description</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Due Date</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <Typography variant="h6" fontWeight="600">
                        {assignment.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {assignment.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">{assignment.createAtdate}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
}
