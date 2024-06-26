
import React, { useEffect, useState } from 'react';
import QCM from './utils/QCM';
import QCU from './utils/QCU';
import TextQuestion from './utils/TextQuestion';
import { useParams } from 'react-router';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Accordion, AccordionSummary, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import ChildCard from 'src/components/shared/ChildCard';
import { IconBriefcase, IconChevronDown, IconClock, IconClock2, IconClockOff, IconNote, IconSchool } from '@tabler/icons';

export default function StudentAssignment() {
    const [questions, setQuestions] = useState([]);
    const { id } = useParams();


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/questions/assignment/${id}`);
                if (response.ok) {
                    const fetchedQuestions = await response.json();
                    console.log('Fetched Questions:', fetchedQuestions);
                    setQuestions(fetchedQuestions.map((q) => ({
                        id: q._id,
                        type: q.type,
                        content: q.content,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        score: q.score
                    })));
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

    const handleClose = () => {
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
                        <Typography variant="h6">Click here to read the assignment description</Typography>
                    </AccordionSummary>
                    <ChildCard
                        bgcolor='#d9080826'
                        color='#a82a2a'
                        title={
                            <Box>
                                <Stack direction="row">
                                    <Typography fontWeight={600} variant="h4" mb={0}>
                                        Assignment Description
                                    </Typography>
                                    <Chip color="primary" size="small" sx={{ marginLeft: 'auto' }} label="French"></Chip>
                                </Stack>
                            </Box>}>

                        <Typography color="textSecondary" variant="subtitle2" mb={2}>
                            You ll get the results instatly or ?
                            <br />
                            You have the timer down below to keep you in sync with the time you have left.
                        </Typography>
                        <Stack direction="row" gap={2} alignItems="center" mb={3}>
                            <IconNote size="21" />
                            <Typography variant="h6">The total score for this assginment is : 60</Typography>
                        </Stack>
                        <Stack direction="row" gap={2} alignItems="center" mb={3}>
                            <IconClock size="21" />
                            <Typography variant="h6">Time to pass the assignment</Typography>
                        </Stack>
                        <Stack direction="row" gap={2} alignItems="center" mb={3}>
                            <IconClockOff size="21" />
                            <Typography variant="h6">The assignment will be closed at</Typography>
                        </Stack>
                    </ChildCard>
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
