import { Avatar, AvatarGroup, Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { IconSearch } from '@tabler/icons';
import axios from 'axios';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import React, { useEffect, useState } from 'react';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';

export default function MyResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthUser();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/results/student/${user.userId}`);
                setResults(response.data);
                console.log("🚀 ~ file: MyResults.js:19 ~ fetchResults ~ response:", response.data);
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [user.userId]);

    return (
        <PageContainer title="Students Dashboard">
            <ParentCard title="Students List">
                <Paper variant="outlined">
                    <TableContainer>
                        <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6">Assignment</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Score</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography variant="subtitle1">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : results.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography variant="subtitle1">No results found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    results.map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="400">
                                                    {result.assignmentId.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {!result.assignmentId.isScheduled || new Date(result.assignmentId.dateSchedule) < new Date() ? (
                                                    result.score
                                                ) : (
                                                    "Not available"
                                                )}
                                            </TableCell>

                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </ParentCard>
        </PageContainer>
    );
}
