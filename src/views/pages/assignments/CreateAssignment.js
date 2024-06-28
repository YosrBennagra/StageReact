import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CreateQCM from './utils/CreateQCM';
import CreateQCU from './utils/CreateQCU';
import CreateTextQuestion from './utils/CreateTextQuestion';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Tooltip, MenuItem, Select, FormControl, InputLabel, Accordion, AccordionSummary, Typography, AccordionDetails, Grid, Input } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';



export default function CreateAssignment() {
    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState('QCM');
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const BCrumb = [
        {
            to: '/admin/dashboard',
            title: 'Dashboard',
        },
        {
            to: '/dashboard/assignments',
            title: 'Assignments',
        },
        {
            title: 'Create',
        },
    ];
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`http://localhost:3001/assignments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssignment(data);
                    setIsScheduled(data.isScheduled);
                    setIsVisible(data.isVisible);
                    setIsInterval(data.isInterval);
                    const [dateEndData, timeEndData] = data.closedAt.split(' ');
                    const [dateStartData, timeStartData] = data.openAt.split(' ');
                    const [dateSheduleData, timeScheduleData] = data.dateSchedule.split(' ');
                    
                    console.log("dateEndData: ", dateEndData);
                    console.log("timeEndData: ", timeEndData);
                    console.log("dateStartData: ", dateStartData);
                    console.log("timeStartData: ", timeStartData);
                    console.log("dateSheduleData: ", dateSheduleData);
                    console.log("timeSheduleData: ", timeScheduleData);
                } else {
                    console.error('Failed to fetch assignment');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAssignment();
    }, [id]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/questions/assignment/${id}`);
                if (response.ok) {
                    const fetchedQuestions = await response.json();
                    setQuestions(fetchedQuestions.map((q) => ({
                        id: q._id,
                        type: q.type,
                        content: q.content,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        score: q.score,

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

    const handleAddQuestion = async () => {
        const newQuestion = {
            assignementId: id,
            content: '',
            options: [],
            correctAnswer: [],
            type: questionType,
            score: 0
        };

        try {
            const response = await fetch('http://localhost:3001/questions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newQuestion),
            });

            if (response.ok) {
                const savedQuestion = await response.json();
                setQuestions((prevQuestions) => [
                    ...prevQuestions,
                    { id: savedQuestion._id, type: questionType },
                ]);
            } else {
                console.error('Failed to add the question');
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:3001/questions/${questionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== questionId));
            } else {
                console.error('Failed to delete the question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleQuestionTypeChange = (event) => {
        setQuestionType(event.target.value);
    };

    const handleSaveQuestion = (questionId) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === questionId ? { ...q, saved: true } : q
            )
        );
    };


    /** Assignement options B **/
    /* Date and Time B */

    const [dateS, setDateS] = useState();
    const [dateE, setDateE] = useState();
    const [timeE, setTimeE] = useState();
    const [timeS, setTimeS] = useState();
    const [dateSchedule, setDateSchedule] = useState();
    const [timeSchedule, setTimeSchedule] = useState();
    const [openAt, setOpenAt] = useState('');
    const [closeAt, setClosedAt] = useState('');


    /* Date and Time  E*/
    /* ******************************************************************** */
    /* Switch cases B */
    const [isVisible, setIsVisible] = useState(false);
    const [isInterval, setIsInterval] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    /* Switch cases E */
    const handleSaveAssignmentSettings = async () => {
        console.log('Saving...')
        console.log('isSheduled: ', isScheduled)
        console.log('isVisible: ', isVisible)
        console.log('isInterval: ', isInterval)
        console.log('Time start: ', timeS)
        console.log('Time End: ', timeE)
        console.log('Date start: ', dateS)
        console.log('Date End: ', dateE)
        console.log('Date Schedule: ', dateSchedule)
        console.log('time Schedule: ', timeSchedule)

        /* Instant score B */
        const updatedAssignment = {
            isScheduled: isScheduled,
            isVisible: isVisible,
            isInterval: isInterval,
            openAt: `${dateS} ${timeS}`,
            closedAt: `${dateE} ${timeE}`,
            dateSchedule: `${dateSchedule} ${timeSchedule}`,
        };
        try {
            await fetch(`http://localhost:3001/assignments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAssignment),
            });
        }
        catch (err) {
            console.log(err);
        }
    }



    /* Instant score E */
    /** Assignement options E **/

    return (
        <>
            <Breadcrumb title="Creating An Assignment" items={BCrumb} />
            <Box sx={{ my: 3 }}>
                <Accordion
                    sx={{
                        backgroundColor: "#30219c26",
                    }}>
                    <AccordionSummary
                        expandIcon={<IconChevronDown />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Click here to edit the assignment options</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item container spacing={3}>{/* Interval/Deadline */}
                                {isInterval ?
                                    <>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Start date:</Typography>
                                            <Input onChange={(e) => setDateS(e.target.value)} type='date'></Input>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Start time:</Typography>
                                            <Input onChange={(e) => setTimeS(e.target.value)} type='time'  ></Input>
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        <Grid item xs={12} lg={4}>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} lg={4}>
                                    DeadLine<CustomSwitch checked={isInterval} onClick={(event) => setIsInterval(event.target.checked)} />Interval
                                </Grid>
                            </Grid>
                            <Grid item container spacing={3}>
                                <Grid item xs={12} lg={4}>
                                    <Typography sx={{ color: (theme) => theme.palette.error.main, fontWeight: 'bold' }}>End date:</Typography>
                                    <Input onChange={(e) => setDateE(e.target.value)} type='date'></Input>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Typography sx={{ color: (theme) => theme.palette.error.main, fontWeight: 'bold' }}>End time:</Typography>
                                    <Input onChange={(e) => setTimeE(e.target.value)} type='time' ></Input>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    Instant Results<CustomSwitch checked={isScheduled} onClick={(event) => setIsScheduled(event.target.checked)} />Scheduled Results
                                </Grid>
                            </Grid>
                            <Grid item container spacing={3}>
                                {isScheduled ?
                                    <>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Schedule date:</Typography>

                                            <Input onChange={(e) => setDateSchedule(e.target.value)} type='date'></Input>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Schedule time:</Typography>
                                            <Input onChange={(e) => setTimeSchedule(e.target.value)} type='time'></Input>
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        <Grid item xs={12} lg={4}>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                        </Grid>
                                    </>}
                                <Grid item xs={12} lg={4}>
                                    Hidden<CustomSwitch checked={isVisible} onClick={(event) => setIsVisible(event.target.checked)} />Visible
                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={12}>
                                <CustomFormLabel sx={{ mt: 0 }} >
                                    Description:
                                </CustomFormLabel>
                                <CustomTextField
                                    helperText="You can provide a description here"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                />
                                <Button sx={{ mt: 2, float: 'right' }} color='primary' onClick={handleSaveAssignmentSettings}>Save your settings</Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

            </Box>
            {questions.map((question) => {
                return (
                    <Box key={question.id} sx={{ mb: 4 }}>
                        {question.type === 'QCM' && <CreateQCM question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                        {question.type === 'QCU' && <CreateQCU question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                        {question.type === 'TEXT' && <CreateTextQuestion question={question} questionId={question.id} assignment={id} onDelete={handleDeleteQuestion} onSave={handleSaveQuestion} />}
                    </Box>
                );
            })}
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                    labelId="question-type-label"
                    value={questionType}
                    onChange={handleQuestionTypeChange}
                    label="Question Type"
                >
                    <MenuItem value="QCM">QCM</MenuItem>
                    <MenuItem value="QCU">QCU</MenuItem>
                    <MenuItem value="TEXT">Text</MenuItem>
                </Select>
            </FormControl>
            <Tooltip title="Add a Question" onClick={handleAddQuestion} fullWidth>
                <Button variant="outlined" color="primary">
                    +
                </Button>
            </Tooltip>
        </>
    );
}
