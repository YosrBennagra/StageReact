import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    IconButton,
    InputAdornment,
    Slide,
    TextField
} from '@mui/material';
import { SearchEmail } from '../../../store/apps/email/EmailSlice';
import { IconMenu2, IconPlus, IconSearch } from '@tabler/icons';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteStudents from './AutoCompleteStudents';
import axios from 'axios';
import {fetchGroupMembers} from '../../../store/apps/groups/groupsSlice';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const StudentSearch = ({ onClick }) => {
    const searchTerm = useSelector((state) => state.emailReducer.emailSearch);
    const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);
    const dispatch = useDispatch();
    const [studentId, setStudentId] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInputChange = (event, newValue) => {
        if (newValue) {
            setStudentId(newValue._id);
        }
    };

    const handleAddStudentToGroup = async () => {
        try {
            await axios.put(`http://localhost:3001/groups/${currentSelectedGroup}/addUser/${studentId}`);
            // Dispatch an action to update the group members list
            dispatch(fetchGroupMembers(currentSelectedGroup));
            handleClose();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <>
            <Box display="flex" sx={{ p: 2 }}>
                <Fab
                    onClick={onClick}
                    color="primary"
                    size="small"
                    sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lineHeight: '10px', lg: 'none' } }}
                >
                    <IconMenu2 width="16" />
                </Fab>
                <CustomTextField
                    id="outlined-basic"
                    InputProps={{
                        endAdornment: (
                            <>
                                <InputAdornment position="end">
                                    <IconButton>
                                        <IconSearch size={'16'} />
                                    </IconButton>
                                    <Box sx={{ width: '1px', height: '24px', backgroundColor: 'grey', mx: 1 }} />
                                    <IconButton onClick={handleClickOpen} color='primary'>
                                        <IconPlus size={'16'} />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        ),
                    }}
                    fullWidth
                    size="small"
                    value={searchTerm}
                    placeholder="Search Student | Add"
                    variant="outlined"
                    onChange={(e) => dispatch(SearchEmail(e.target.value))}
                />
            </Box>

            <Box>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    fullWidth
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Add a Student</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" component="div">
                            <CustomFormLabel htmlFor="group-name">Insert Student Name</CustomFormLabel>
                            <AutoCompleteStudents onInputChange={handleInputChange} />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddStudentToGroup} color="primary" variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default StudentSearch;
