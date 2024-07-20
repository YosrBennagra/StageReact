import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Paper,
    TableContainer,
    TextField,
    InputAdornment,
    IconButton,
    Button,
} from '@mui/material';
import axios from 'axios';
import { IconArrowUpRight, IconSearch } from '@tabler/icons';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
const BCrumb = [
    {
        to: '/',
        title: 'Profile',
    },
    {
        title: 'Your assignments',
    },
];

export default function StudentDashboardAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const user = useAuthUser();
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                if (user.role === 'student') {

                    const response = await axios.get(`http://localhost:3001/assignments/assignedToUserOrGroup/${user.userId}`);
                    const fetchedAssignments = response.data;
                    setAssignments(fetchedAssignments);

                } else {
                    const response = await axios.get('http://localhost:3001/assignments');
                    const fetchedAssignments = response.data;
                    setAssignments(fetchedAssignments);
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, [user.userId]);

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGoToAssignment = async (id) => {
        navigate(`/pass/assignment/${id}`);
        await axios.post(`http://localhost:3001/assignment-durations/`,{assignment:id , user: user.userId});
    };

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
                                        <Typography variant="h6">Status</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Due Date</Typography>
                                    </TableCell>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">

                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">

                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAssignments.map((assignment) =>
                                    assignment.isVisible ? (
                                        <TableRow key={assignment._id}>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="600">
                                                    {assignment.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    sx={{
                                                        bgcolor:
                                                            assignment.status === 'open'
                                                                ? (theme) => theme.palette.success.light
                                                                : assignment.status === 'pending'
                                                                    ? (theme) => theme.palette.warning.light
                                                                    : assignment.status === 'ended'
                                                                        ? (theme) => theme.palette.error.light
                                                                        : (theme) => theme.palette.secondary.light,
                                                        color:
                                                            assignment.status === 'open'
                                                                ? (theme) => theme.palette.success.main
                                                                : assignment.status === 'pending'
                                                                    ? (theme) => theme.palette.warning.main
                                                                    : assignment.status === 'ended'
                                                                        ? (theme) => theme.palette.error.main
                                                                        : (theme) => theme.palette.secondary.main,
                                                        borderRadius: "8px",
                                                        textTransform: 'capitalize'
                                                    }}
                                                    size="small"
                                                    label={assignment.status}
                                                />

                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{assignment.closedAt}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    assignment.userpassed.includes(user.userId) ? (
                                                        <Chip
                                                            sx={{
                                                                bgcolor: (theme) => theme.palette.success.light,
                                                                color: (theme) => theme.palette.success.main,
                                                                borderRadius: "8px",
                                                                textTransform: 'capitalize'
                                                            }}
                                                            label={"Passed"}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Chip
                                                            sx={{
                                                                bgcolor: (theme) => theme.palette.error.light,
                                                                color: (theme) => theme.palette.error.main,
                                                                borderRadius: "8px",
                                                                textTransform: 'capitalize'
                                                            }}
                                                            label={"Not Passed"}
                                                            size="small"
                                                        />
                                                    )}
                                            </TableCell>
                                            <TableCell>
                                                {assignment.status !== 'ended' && !assignment.userpassed.includes(user.userId) && (
                                                    <IconButton>
                                                        <IconArrowUpRight onClick={() => handleGoToAssignment(assignment._id)} color="#1a44ad" />
                                                    </IconButton>
                                                )}
                                            </TableCell>

                                        </TableRow>
                                    ) : null
                                )}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </ParentCard>
        </PageContainer >
    );
}
