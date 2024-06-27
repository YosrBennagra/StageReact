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
} from '@mui/material';
import axios from 'axios';
import { IconArrowUpRight, IconSearch } from '@tabler/icons';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router';

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

    const handleGoToAssignment = (id) => {
        navigate(`/pass/assignment/${id}`);
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/assignments/${id}`);
            setAssignments((prevAssignments) =>
                prevAssignments.filter((assignment) => assignment._id !== id)
            );
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    return (
        <PageContainer title="Assignments" description="This is the Assignments page">
            {/* breadcrumb */}
            <Breadcrumb title="Assignments" items={BCrumb} />
            {/* end breadcrumb */}
            {/* Options B */}

            {/* Options E */}
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
                                    <TableCell >
                                        <Typography variant="h6"></Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6"></Typography>
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
                                            <Chip
                                                sx={{
                                                    bgcolor:
                                                        assignment.status === 'open'
                                                            ? (theme) => theme.palette.success.light
                                                            : assignment.status === 'pending'
                                                                ? (theme) => theme.palette.warning.light
                                                                : assignment.status === 'ended'
                                                                    ? (theme) => theme.palette.primary.light
                                                                    : assignment.status === 'canceled'
                                                                        ? (theme) => theme.palette.error.light
                                                                        : (theme) => theme.palette.secondary.light,
                                                    color:
                                                        assignment.status === 'open'
                                                            ? (theme) => theme.palette.success.main
                                                            : assignment.status === 'pending'
                                                                ? (theme) => theme.palette.warning.main
                                                                : assignment.status === 'ended'
                                                                    ? (theme) => theme.palette.primary.main
                                                                    : assignment.status === 'canceled'
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
                                            <Typography variant="h6">{assignment.createAtdate}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                sx={{
                                                    bgcolor: (theme) => theme.palette.success.light,
                                                    color: (theme) => theme.palette.success.main,
                                                    borderRadius: "8px",
                                                    textTransform: 'capitalize'
                                                }}
                                                label={"Passed"}
                                                size="small"
                                            ></Chip>
                                            <br />
                                            <Chip
                                                sx={{
                                                    bgcolor: (theme) => theme.palette.error.light,
                                                    color: (theme) => theme.palette.error.main,
                                                    borderRadius: "8px",
                                                    textTransform: 'capitalize'
                                                }}
                                                label={"Not Passed"}
                                                size="small"
                                            ></Chip>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <IconArrowUpRight onClick={() => { handleGoToAssignment(assignment._id) }} color="#1a44ad" />
                                            </IconButton>
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
