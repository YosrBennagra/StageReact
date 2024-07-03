import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack, Typography } from '@mui/material';
import { IconChevronDown, IconClock, IconClockOff, IconInfoCircle, IconNote } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ChildCard from 'src/components/shared/ChildCard';
import QCM from './utils/QCM';
import QCU from './utils/QCU';
import TextQuestion from './utils/TextQuestion';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format } from 'date-fns';

export default function StudentAssignment() {
    const [questions, setQuestions] = useState([]);
    const { id } = useParams();
    const user = useAuthUser();
    const customizer = useSelector((state) => state.customizer);
    const [endTime, setEndTime] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [isScheduled, setIsScheduled] = useState(false);
    const [dateSchedule, setDateSchedule] = useState(null);
    const [timeSchedule, setTimeSchedule] = useState(null);
    const [description, setDescription] = useState(null);
    useEffect(() => {
        const getAssignmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/assignments/${id}`);
                if (response.status === 200) {
                    console.log("🚀 ~ file: StudentAssignment.js:23 ~ getAssignmentDetails ~ response:", response);

                    setIsScheduled(response.data.isScheduled);
                    const dateSchedule = response.data.dateSchedule;
                    console.log("🚀 ~ file: StudentAssignment.js:32 ~ getAssignmentDetails ~ dateSchedule:", dateSchedule);
                    const [dateS, timeS] = dateSchedule.split(' ');
                    setDescription(response.data.description);
                    setDateSchedule(dateS);
                    setTimeSchedule(timeS);
                    const [DateEnd, timeEnd] = response.data.closedAt.split(' ');
                    setEndTime(timeEnd);
                    setEndDate(DateEnd);
                    console.log("🚀 ~ file: StudentAssignment.js:39 ~ getAssignmentDetails ~ timeS:", timeS);
                    console.log("🚀 ~ file: StudentAssignment.js:39 ~ getAssignmentDetails ~ dateS:", dateS);
                } else {
                    console.error('Failed to fetch assignment');
                }

            } catch (error) {
                console.error('Error fetching assignment:', error);
            }
        };
        getAssignmentDetails();
    }, [id]);


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/questions/assignment/${id}`);
                if (response.ok) {
                    const fetchedQuestions = await response.json();
                    console.log('Fetched Questions:', fetchedQuestions);
                    setQuestions(fetchedQuestions.map((q) => ({
                        id: q._id,
                        assignmentId: q.assignementId,
                        type: q.type,
                        content: q.content,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        score: q.score,
                    })));
                    setTotalScore(fetchedQuestions.reduce((acc, q) => acc + q.score, 0));
                } else {
                    console.error('Failed to fetch questions');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [id]);

    /* Confirm Dialog B */
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        try {
            const response = await fetch(`http://localhost:3001/assignments/${id}/userPassed/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                console.log("🚀 ~ file: StudentAssignment.js:60 ~ handleClose ~ response:", response);
            } else {
                console.error('Failed to add the answer');
            }
        } catch (error) {
            console.error('Error adding answer:', error);
        }
        setOpen(false);
    };
    /* Confirm Dialog E */
    return (
        <>
            <Box sx={{ my: 3 }}>
                <Accordion
                    sx={{
                        backgroundColor: "#d9080826",
                    }}>
                    <AccordionSummary

                        expandIcon={<IconChevronDown />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Click here to read the assignment description ...</Typography> <IconInfoCircle size="21"></IconInfoCircle>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card
                            sx={{ padding: 0,backgroundColor: "#b41a1a00" }}
                            elevation={customizer.isCardShadow ? 9 : 0}
                            variant={!customizer.isCardShadow ? 'outlined' : undefined}>
                            <CardHeader                             title={
                                <Box>
                                    <Stack direction="row">
                                        <Typography fontWeight={600} variant="h4" mb={0}>
                                            Assignment Description
                                        </Typography>
                                        <Chip color="primary" size="small" sx={{ marginLeft: 'auto' }} label="French"></Chip>
                                    </Stack>
                                </Box>}
                            />
                            <Divider sx={{borderColor:'#601919'}}/>
                            <CardContent>
                                <Typography color="textSecondary" variant="subtitle2" mb={2}>
                                    {isScheduled ?
                                        <Typography display={"flex"}> Your results will be available on
                                            <Typography sx={{ marginX: 1 }} color="primary"> {format(new Date(dateSchedule), 'd MMM yyyy')}</Typography> at
                                            <Typography sx={{ marginX: 1 }} color="primary"> {timeSchedule}</Typography></Typography> :
                                        "Your results will be accessible instantly after you complete the assignment."}
                                    <br />
                                    <Typography display={"flex"} variant='subtitle'>You' ll have the timer down below to keep you in sync with the time you have left.<IconInfoCircle size={15}></IconInfoCircle></Typography>
                                    <br />
                                    {description ? <Typography variant='h6' fontWeight={500} color={"secondary"}>{description}</Typography> : null}
                                </Typography>
                                <Stack direction="row" gap={2} alignItems="center" mb={3}>
                                    <IconNote size="21" />
                                    <Typography display={"flex"}> <Typography variant="h6">The total score for this assginment is :</Typography><Typography variant='h6' fontWeight={600} color="primary"> {totalScore}</Typography></Typography>
                                </Stack>
                                <Stack direction="row" gap={2} alignItems="center" mb={3}>
                                    <IconClock size="21" />
                                    <Typography display={"flex"}><Typography variant="h6">Time to pass the assignment</Typography><Typography>$Time</Typography></Typography>
                                </Stack>
                                <Stack direction="row" gap={2} alignItems="center" mb={3}>
                                    <IconClockOff size="21" />
                                    <Typography variant="h6" display={"flex"}>The assignment will be closed on
                                        <Typography sx={{ marginX: 1 }} color="primary">{format(new Date(endDate), 'd MMM yyyy')} </Typography>at
                                        <Typography sx={{ marginX: 1 }} color="primary"> {endTime}</Typography>
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </AccordionDetails>
                </Accordion>
            </Box>
            {questions.map((question) => {
                console.log(`Rendering ${question.type} question with id ${question.id}`);
                return (
                    <Box key={question.id} sx={{ mb: 4 }}>
                        {question.type === 'QCM' && <QCM question={question} />}
                        {question.type === 'QCU' && <QCU question={question} />}
                        {question.type === 'TEXT' && <TextQuestion question={question} />}
                    </Box>
                );
            })}
            <Box
            >
                <Card
                    sx={{ textAlignLast: "center" }}>
                    <Button fullWidth color='primary' onClick={handleClickOpen}>Finish</Button>
                </Card>
            </Box>

            {/* Dialoag B */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Please read carefully"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography>
                            Please review your answers carefully. Once you click the <strong>"Submit"</strong> button, you will not be able to modify your answers.
                            If you are sure these are the answers you want to submit, click <strong>"Submit"</strong> to confirm.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} autoFocus color='success'>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Dialoag E */}
        </>
    );
}
