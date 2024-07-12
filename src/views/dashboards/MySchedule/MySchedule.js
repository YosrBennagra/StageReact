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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
export default function MySchedule() {
    const [schedule, setSchedule] = useState({});
    const [open, setOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({ day: '', time: '' });
    const [subject, setSubject] = useState('');
    const [classes, setClasses] = useState([]);
    const [classe, setClasse] = useState('');
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [totalHours, setTotalHours] = useState(0);
    const user = useAuthUser()

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/classrooms');
                if (user.role === 'student') {
                    const responseUser = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
                    setClasse(responseUser.data.classroom);
                    console.log("🚀 ~ file: MySchedule.js:48 ~ fetchClasses ~ responseUser:", responseUser.data.classroom);
                }
                setClasses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching classes:', error);
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);
    useEffect(() => {
        const calculateTotalHours = () => {
            let hours = 0;
            Object.keys(schedule).forEach(slot => {
                if (schedule[slot]) {
                    hours += 1;
                }
            });
            setTotalHours(hours);
        };

        calculateTotalHours();
    }, [schedule]);
    useEffect(() => {
        const fetchGroupsAndSchedule = async () => {
            if (classe) {
                try {
                    setGroupsLoading(true);
                    const [groupsResponse, scheduleResponse] = await Promise.all([
                        axios.get(`http://localhost:3001/classrooms/${classe}`),
                        axios.get(`http://localhost:3001/schedules/${classe}`)
                    ]);

                    if (groupsResponse.data.groups && Array.isArray(groupsResponse.data.groups)) {
                        setGroups(groupsResponse.data.groups);
                    } else {
                        console.error('Invalid groups data format:', groupsResponse.data);
                        setGroups([]);
                    }

                    if (scheduleResponse.data.schedule && typeof scheduleResponse.data.schedule === 'object') {
                        setSchedule(scheduleResponse.data.schedule);
                    } else {
                        console.error('Invalid schedule data format:', scheduleResponse.data);
                        setSchedule({});
                    }

                    setGroupsLoading(false);
                } catch (error) {
                    setGroupsLoading(false);
                    console.error('Error fetching groups and schedule:', error);
                }
            } else {
                setGroups([]);
                setSchedule({});
                setGroupsLoading(false);
            }
        };

        fetchGroupsAndSchedule();
    }, [classe]);

    const handleClickOpen = (day, time) => {
        setCurrentSlot({ day, time });
        setSubject(schedule[`${day}-${time}`] || '');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const newSchedule = { ...schedule, [`${currentSlot.day}-${currentSlot.time}`]: subject };
        setSchedule(newSchedule);
        saveToDatabase(newSchedule);
        setOpen(false);
    };

    const handleRemove = (day, time) => {
        const newSchedule = { ...schedule };
        delete newSchedule[`${day}-${time}`];
        setSchedule(newSchedule);
        saveToDatabase(newSchedule);
    };

    const saveToDatabase = async (schedule) => {
        try {
            await axios.post(`http://localhost:3001/schedules/${classe}`, { schedule });
            console.log('Saved to database:', schedule);
        } catch (error) {
            console.error('Error saving to database:', error);
        }
    };

    const handleClassChange = (event) => {
        setClasse(event.target.value);
    };

    const handleSubjectChange = (event) => {
        setSubject(event.target.value);
    };

    const getGroupNameById = (id) => {
        const group = groups.find(group => group._id === id);
        return group ? group.name : '';
    };
    return (
        <div style={{ padding: '20px' }}>
            {user.role === 'student' ? (null) :
                (
                    <Typography variant="h4" gutterBottom>
                        My Schedule
                    </Typography>
                )}

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    {user.role === 'student' ? (null) : (
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Day/Time</TableCell>
                            {timeSlots.map((time) => (
                                <TableCell key={time}>{time}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {daysOfWeek.map((day) => (
                            <TableRow key={day}>
                                <TableCell>{day}</TableCell>
                                {timeSlots.map((time) => (
                                    <TableCell key={`${day}-${time}`}>
                                        {schedule[`${day}-${time}`] ? (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" style={{ flexGrow: 1 }}>
                                                    {getGroupNameById(schedule[`${day}-${time}`])}
                                                </Typography>
                                                {user.role === 'student' ? (null) : (
                                                    <>
                                                        <IconButton onClick={() => handleClickOpen(day, time)}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleRemove(day, time)}>
                                                            <Delete />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            user.role === 'student' ? (null) : (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleClickOpen(day, time)}
                                                    startIcon={<Add />}
                                                >
                                                    Add
                                                </Button>)
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            Total Hours: {totalHours}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{subject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
                <DialogContent>
                    <Select
                        labelId="select-subject-label"
                        id="select-subject"
                        value={subject}
                        onChange={handleSubjectChange}
                        label="Subjects"
                        fullWidth
                        variant="outlined"
                    >
                        {groupsLoading ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                                Loading subjects...
                            </MenuItem>
                        ) : (
                            groups.map((group) => (
                                <MenuItem key={group._id} value={group._id}>
                                    {group.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </DialogContent>
                {user.role === 'student' ? (null) : (
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </div>
    );
}
