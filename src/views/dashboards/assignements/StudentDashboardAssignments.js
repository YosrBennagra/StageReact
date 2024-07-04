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
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';

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
    const [isPassed, setIsPassed] = useState(false);
    const [timeLeft, setTimeLeft] = useState({});
    const navigate = useNavigate();
    const user = useAuthUser();
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get('http://localhost:3001/assignments');
                const fetchedAssignments = response.data;
                setAssignments(fetchedAssignments);
                const userHasPassed = fetchedAssignments.some(assignment =>
                    assignment.userpassed.includes(user.userId)
                );
                setIsPassed(userHasPassed);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, [user.userId]);

    const filteredAssignments = assignments.filter((assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGoToAssignment = (id) => {
        navigate(`/pass/assignment/${id}`);
    };

    const calculateTimeLeft = (dateSchedule) => {
        const now = new Date();
        const date = new Date(dateSchedule);
        const days = differenceInDays(date, now);
        const hours = differenceInHours(date, now) % 24;
        const minutes = differenceInMinutes(date, now) % 60;
        const seconds = differenceInSeconds(date, now) % 60;

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimeLeft = {};
            assignments.forEach((assignment) => {
                updatedTimeLeft[assignment._id] = calculateTimeLeft(assignment.dateSchedule);
            });
            setTimeLeft(updatedTimeLeft);
        }, 1000);

        return () => clearInterval(interval);
    }, [assignments]);
    const handleResultsDisplay = async (id, userid) => {
        try {
            const response = await axios.get(`http://localhost:3001/results/student/${userid}/${id}`);
            const results = response.data;
            setResults(results.score);
            setShowResults(!showResults);
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    }
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
                                        <Typography variant="h6">
                                            Results
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6"></Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6"></Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAssignments.map((assignment) => (
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
                                            <Typography variant="h6">{format(new Date(assignment.closedAt), 'dd MMM yyyy hh:mm')}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {isPassed && !showResults && timeLeft[assignment._id] ? (
                                                <>
                                                    <Typography> Time left to display results:</Typography>
                                                    <Typography color={"primary"}>{timeLeft[assignment._id]}</Typography>
                                                </>
                                            ) : (
                                                showResults ?
                                                    (
                                                        <Typography display={"flex"}>Total score :<Typography marginX={1} color={"primary"}>{results}</Typography></Typography>
                                                    )
                                                    : (<Button
                                                        color='primary'
                                                        onClick={() => handleResultsDisplay(assignment._id, user.userId)}>
                                                        Display results
                                                    </Button>
                                                    )

                                            )}

                                        </TableCell>
                                        <TableCell>
                                            {isPassed ? <Chip
                                                sx={{
                                                    bgcolor: (theme) => theme.palette.success.light,
                                                    color: (theme) => theme.palette.success.main,
                                                    borderRadius: "8px",
                                                    textTransform: 'capitalize'
                                                }}
                                                label={"Passed"}
                                                size="small"
                                            ></Chip> : <Chip
                                                sx={{
                                                    bgcolor: (theme) => theme.palette.error.light,
                                                    color: (theme) => theme.palette.error.main,
                                                    borderRadius: "8px",
                                                    textTransform: 'capitalize'
                                                }}
                                                label={"Not Passed"}
                                                size="small"
                                            ></Chip>}
                                        </TableCell>
                                        <TableCell>
                                            {isPassed ?
                                                null
                                                : <IconButton>
                                                    <IconArrowUpRight onClick={() => { handleGoToAssignment(assignment._id) }} color="#1a44ad" />
                                                </IconButton>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </ParentCard>
        </PageContainer >
    );
}
