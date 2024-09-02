import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Typography,
    CircularProgress,
    IconButton,
    TextField,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MySchedule() {
    const [schedule, setSchedule] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({ day: '', time: '' });
    const [subject, setSubject] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classe, setClasse] = useState('');
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newTimeSlot, setNewTimeSlot] = useState('');
    const user = useAuthUser();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/classrooms');
                const classData = Array.isArray(response.data.classrooms) ? response.data.classrooms : []; // Extract classrooms array
                if (user.role === 'student') {
                    const responseUser = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
                    setClasse(responseUser.data.classroom);
                    console.log("🚀 ~ file: MySchedule.js:49 ~ fetchClasses ~ responseUser:", responseUser);
                }
                setClasses(classData);
                setLoading(false);
                console.log('Classes fetched:', classData);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };

        fetchClasses();
    }, [user.userId, user.role]);



    useEffect(() => {
        if (classe) {
            const fetchSubjectsAndSchedule = async () => {
                try {
                    const responseUser = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
                    const [subjectsResponse, scheduleResponse, timeSlotsResponse] = await Promise.all([
                        axios.get(`http://localhost:3001/subjects/getsubjectsBy/${responseUser.data.institution}`),
                        axios.get(`http://localhost:3001/schedules/${classe}`),
                        axios.get(`http://localhost:3001/timeslots/${classe}`),
                    ]);
                    setSubjects(subjectsResponse.data);
                    setSchedule(Array.isArray(scheduleResponse.data) ? scheduleResponse.data : []);
                    setTimeSlots(timeSlotsResponse.data);
                    console.log('Subjects fetched:', subjectsResponse.data);
                    console.log('Schedule fetched:', scheduleResponse.data);
                    console.log('Time slots fetched:', timeSlotsResponse.data);
                } catch (error) {
                    console.error('Error fetching subjects, schedule, and time slots:', error);
                }
            };

            fetchSubjectsAndSchedule();
        }
    }, [classe, user.userId]);

    useEffect(() => {
        // Load schedule from localStorage on component mount
        const savedSchedule = JSON.parse(localStorage.getItem('schedule'));
        if (savedSchedule) {
            setSchedule(savedSchedule);
        }
    }, []);

    const handleClickOpen = (day, time) => {
        setCurrentSlot({ day, time });
        setSubject('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const newEntry = { ...currentSlot, subject };
        const newSchedule = Array.isArray(schedule) ? [...schedule, newEntry] : [newEntry];
        setSchedule(newSchedule);
        saveToLocalStorage(newSchedule); // Save updated schedule to localStorage
        setOpen(false);

        try {
            const response = await axios.post(`http://localhost:3001/schedules/${classe}`, newSchedule);
            setSchedule(response.data); // Update the state with the response from the server
            console.log('Schedule saved and fetched successfully:', response.data);
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };


    const handleRemove = async (scheduleId) => {
        try {
            await axios.delete(`http://localhost:3001/schedules/${scheduleId}`);
            const newSchedule = schedule.filter(slot => slot._id !== scheduleId);
            setSchedule(newSchedule);
            saveToLocalStorage(newSchedule);
            console.log('Schedule entry removed successfully');
        } catch (error) {
            console.error('Error removing schedule entry:', error);
        }
    };


    const saveToLocalStorage = (schedule) => {
        localStorage.setItem('schedule', JSON.stringify(schedule));
    };

    const handleClassChange = (event) => {
        setClasse(event.target.value);
    };

    const handleSlotChange = (event) => {
        setCurrentSlot({ ...currentSlot, [event.target.name]: event.target.value });
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const handleNewTimeSlotChange = (event) => {
        setNewTimeSlot(event.target.value);
    };

    const addTimeSlot = async () => {
        if (newTimeSlot && !timeSlots.some(time => time.time === newTimeSlot)) {
            try {
                const response = await axios.post('http://localhost:3001/timeslots', { day: 'Any', time: newTimeSlot, classId: classe });
                setTimeSlots([...timeSlots, response.data]);
                setNewTimeSlot('');
            } catch (error) {
                console.error('Error adding time slot:', error);
            }
        }
    };

    const deleteTimeSlot = async (slot) => {
        try {
            await axios.delete(`http://localhost:3001/timeslots/${slot._id}`);
            setTimeSlots(timeSlots.filter(time => time._id !== slot._id));
        } catch (error) {
            console.error('Error deleting time slot:', error);
        }
    };

    const findSubjectName = (subjectId) => {
        console.log("🚀 ~ file: MySchedule.js:168 ~ findSubjectName ~ subjectId:", subjectId);
        const subject = subjects.find(sub => sub._id === subjectId);
        console.log("🚀 ~ file: MySchedule.js:161 ~ findSubjectName ~ subject:", subject);
        return subject ? subject.name : '';
    };

    return (
        <div style={{ padding: '20px' }}>
            {user.role === 'student' ? null : (
                <Typography variant="h4" gutterBottom>
                    My Schedule
                </Typography>
            )}

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    {user.role === 'student' ? null : (
                        <Select
                            labelId="select-classe-label"
                            id="select-classe"
                            value={classe}
                            onChange={handleClassChange}
                            label="Classes"
                            fullWidth
                            variant="outlined"
                            disabled={loading || classes.length === 0}
                        >
                            {loading ? (
                                <MenuItem disabled>
                                    <CircularProgress size={24} />
                                    Loading classes...
                                </MenuItem>
                            ) : (
                                classes.map((classe) => (
                                    <MenuItem key={classe._id} value={classe._id}>
                                        {classe.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    )}
                </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="New Time Slot"
                        value={newTimeSlot}
                        onChange={handleNewTimeSlotChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <Button onClick={addTimeSlot} color="primary" variant="contained">
                        Add Time Slot
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day/Time</TableCell>
                            {timeSlots.map((time) => (
                                <TableCell key={time._id}>
                                    {time.time}
                                    <IconButton onClick={() => deleteTimeSlot(time)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysOfWeek.map((day) => (
                            <TableRow key={day}>
                                <TableCell>{day}</TableCell>
                                {timeSlots.map((time) => (
                                    <TableCell key={`${day}-${time._id}`}>
                                        {Array.isArray(schedule) && schedule.find(slot => slot.day === day && slot.time === time.time) ? (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" style={{ flexGrow: 1 }}>
                                                    {findSubjectName(schedule.find(slot => slot.day === day && slot.time === time.time).subject._id)}
                                                    {console.log("🚀 ~ file: MySchedule.js:244 ~ MySchedule ~ schedule:", schedule)}
                                                </Typography>
                                                {user.role === 'student' ? null : (
                                                    <>
                                                        <IconButton onClick={() => handleClickOpen(day, time.time)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleRemove(schedule.find(slot => slot.day === day && slot.time === time.time)._id)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <Button variant="outlined" color="primary" onClick={() => handleClickOpen(day, time.time)}>
                                                Add
                                            </Button>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Subject</DialogTitle>
                <DialogContent>
                    <Select
                        labelId="select-subject-label"
                        id="select-subject"
                        value={subject}
                        onChange={handleSubjectChange}
                        label="Subject"
                        fullWidth
                        variant="outlined"
                    >
                        {subjects.map((sub) => (
                            <MenuItem key={sub._id} value={sub._id}>
                                {sub.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}