import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import CreateQCM from './utils/CreateQCM';
import CreateQCU from './utils/CreateQCU';
import CreateTextQuestion from './utils/CreateTextQuestion';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Tooltip, MenuItem, Select, FormControl, InputLabel, Accordion, AccordionSummary, Typography, AccordionDetails, Grid, Input, Autocomplete } from '@mui/material';
import { IconChevronDown } from '@tabler/icons';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from 'src/store/apps/groups/groupsSlice';
import { fetchUsers } from 'src/store/apps/users/usersSlice';

export default function CreateAssignment() {
    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState('QCM');
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => state.groups.groups);
    const allUsers = useSelector((state) => state.users.users);
    const [options, setOptions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [assignedGroups, setAssignedGroups] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [duration, setDuration] = useState(0);
    const [isDuration, setIsDuration] = useState(false);
    useEffect(() => {
        console.log('All groups:', allGroups);
        console.log('All users:', allUsers);
        console.log('Assigned groups:', assignedGroups);
        console.log('Assigned users:', assignedUsers);

        // Create options for all groups and users
        const groupOptions = allGroups.map((group) => ({
            ...group,
            type: 'Group',
        }));

        const userOptions = allUsers.map((user) => ({
            ...user,
            type: 'User',
        }));

        // Create options for assigned groups and users
        const assignedGroupOptions = assignedGroups.map((group) => ({
            ...group,
            type: 'Group',
            assigned: true,
        }));

        const assignedUserOptions = assignedUsers.map((user) => ({
            ...user,
            type: 'User',
            assigned: true,
        }));

        // Combine all options, including assigned ones
        const options = [
            ...groupOptions,
            ...userOptions,

        ];
        const selectedOptions = [
            ...assignedGroupOptions,
            ...assignedUserOptions,
        ]
        setSelectedOptions(selectedOptions);
        setOptions(options);
    }, [allGroups, allUsers, assignedGroups, assignedUsers]);



    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchUsers());
    }, [dispatch]);

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
    /* Fetch groups and Users */

    /* Fetch assignment B*/
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
                    setDateE(dateEndData);
                    setTimeE(timeEndData);
                    setDateS(dateStartData);
                    setTimeS(timeStartData);
                    setDateSchedule(dateSheduleData);
                    setTimeSchedule(timeScheduleData);
                    setDescription(data.description);
                    setAssignedUsers(data.assignedToUsers);
                    setAssignedGroups(data.assignedToGroups);
                    setDuration(data.duration);
                    setIsDuration(data.isDuration);
                } else {
                    console.error('Failed to fetch assignment');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAssignment();
    }, [id]);
    /* Fetch assignment E */

    /* Fetch questions B */
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
    /* Date and Time  E*/
    /* ******************************************************************** */
    /* Switch cases B */
    const [isVisible, setIsVisible] = useState(false);
    const [isInterval, setIsInterval] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    /* Switch cases E */
    /* ******************************************************************** */
    /* Description B */
    const [description, setDescription] = useState('');
    /* Description E */
    const handleSaveAssignmentSettings = async () => {
        const updatedAssignment = {
            isScheduled: isScheduled,
            isVisible: isVisible,
            isInterval: isInterval,
            openAt: `${dateS} ${timeS}`,
            closedAt: `${dateE} ${timeE}`,
            dateSchedule: `${dateSchedule} ${timeSchedule}`,
            description: description,
            duration: duration,
            isDuration: isDuration,
        };
        console.log("🚀 ~ file: CreateAssignment.js:251 ~ handleSaveAssignmentSettings ~ updatedAssignment.duration:", updatedAssignment.duration);
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
    /** Assignement options E **/

    const handleInputChange = (event, value) => {
        setSelectedOptions(value);
    };

    const handleConfirmAssignments = async () => {
        const userIdsToAdd = selectedOptions.filter(option => option.type === 'User').map(user => user._id);
        const groupIdsToAdd = selectedOptions.filter(option => option.type === 'Group').map(group => group._id);
        console.log(userIdsToAdd);
        console.log(JSON.stringify(groupIdsToAdd));
        try {
            await fetch(`http://localhost:3001/assignments/${id}/updateAssignedUsers`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userIdsToAdd),
            });
            await fetch(`http://localhost:3001/assignments/${id}/updateAssignedGroups`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupIdsToAdd),
            });
            console.log('Assignment updated successfully.');
        } catch (error) {
            console.error('Error updating users/groups to assignment:', error);
        }
    };


    return (
        <>
            <Breadcrumb title="Creating An Assignment" items={BCrumb} />
            <Box sx={{ my: 3 }}>
                <Accordion
                    sx={{
                        backgroundColor: "#30219c26",
                    }}
                >
                    <AccordionSummary
                        expandIcon={<IconChevronDown />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <Typography variant="h6">Click here to add groups / users to the assignemnt</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Autocomplete
                            multiple
                            fullWidth
                            id="tags-outlined"
                            options={options}
                            getOptionLabel={(option) => option.name || option.username}
                            groupBy={(option) => option.type}
                            filterSelectedOptions
                            value={selectedOptions}
                            onChange={handleInputChange}
                            onDelete={(option) => console.log(option)}
                            renderInput={(params) => (
                                <CustomTextField
                                    helperText="Type the name of the user or the group you want to add"
                                    variant="outlined"
                                    fullWidth
                                    {...params}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option._id === value._id}

                        />
                        <Button sx={{ mb: 2, float: 'right' }} color='primary' onClick={handleConfirmAssignments}>Confirm</Button>

                    </AccordionDetails>
                </Accordion>
            </Box>
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
                                            <Input onChange={(e) => setDateS(e.target.value)} type='date' value={dateS}></Input>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Start time:</Typography>
                                            <Input onChange={(e) => setTimeS(e.target.value)} type='time' value={timeS}></Input>
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
                                    Deadline<CustomSwitch checked={isInterval} onClick={(event) => setIsInterval(event.target.checked)} />Interval
                                </Grid>
                            </Grid>
                            <Grid item container spacing={3}>
                                <Grid item xs={12} lg={4}>
                                    <Typography sx={{ color: (theme) => theme.palette.error.main, fontWeight: 'bold' }}>End date:</Typography>
                                    <Input onChange={(e) => setDateE(e.target.value)} type='date' value={dateE}></Input>
                                </Grid>
                                <Grid item xs={12} lg={4}>
                                    <Typography sx={{ color: (theme) => theme.palette.error.main, fontWeight: 'bold' }}>End time:</Typography>
                                    <Input onChange={(e) => setTimeE(e.target.value)} type='time' value={timeE}></Input>
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
                                            <Input onChange={(e) => setDateSchedule(e.target.value)} type='date' value={dateSchedule}></Input>
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Schedule time:</Typography>
                                            <Input onChange={(e) => setTimeSchedule(e.target.value)} type='time' value={timeSchedule}></Input>
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
                            <Grid item container spacing={3}>{/* Interval/Deadline */}
                                {isDuration ?
                                    <>
                                        <Grid item xs={12} lg={8}>
                                            <Typography sx={{ color: (theme) => theme.palette.success.main, fontWeight: 'bold' }}>Set the duration time in minutes</Typography>
                                            <Input onChange={(e) => setDuration(e.target.value)} type='number' value={duration}></Input>
                                        </Grid>
                                    </>
                                    :
                                    <>
                                        <Grid item xs={12} lg={8}>
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={12} lg={4}>
                                    Set Duration<CustomSwitch checked={isDuration} onClick={(event) => setIsDuration(event.target.checked)} />No Duration
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
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                />
                                <Button sx={{ float: 'right' }} color='primary' onClick={handleSaveAssignmentSettings}>Save your settings</Button>
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
