import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  Slide,
  TextField,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  Select,
} from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GroupCreate = ({ onAddGroup }) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthUser();
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const responseUser = await axios.get(`http://localhost:3001/userinfos/byuser/${user.userId}`);
        const response = await axios.get(`http://localhost:3001/subjects/getsubjectsBy/${responseUser.data.institution}`);
        setSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddGroup = async () => {
    const newGroup = {
      name: groupName,
      subject: subject,
    };

    try {
      const response = await fetch('http://localhost:3001/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      if (response.ok) {
        const createdGroup = await response.json();
        onAddGroup(createdGroup);
        console.log('Successfully added the group');
        handleClose();
      } else {
        console.error('Failed to add the group');
      }
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleInputChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  return (
    <Box>
      <Box p={3} pb={1}>
        <Button variant="contained" fullWidth color="primary" onClick={handleClickOpen}>
          Create Group
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Create New Group</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="group-name">Group Name</CustomFormLabel>
            <TextField
              id="group-name"
              fullWidth
              size="small"
              variant="outlined"
              value={groupName}
              onChange={handleInputChange}
              helperText="Enter group name in the input above"
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="group-name">Assign a subject</CustomFormLabel>
            <Select
              labelId="select-subject-label"
              id="select-subject"
              value={subject}
              onChange={handleSubjectChange}
              label="Subjects"
              fullWidth
              variant="outlined"
              disabled={loading || subjects.length === 0}
            >
              {loading ? (
                <MenuItem disabled>Loading subjects...</MenuItem>
              ) : (
                subjects.map((subject) => (
                  <MenuItem key={subject._id} value={subject._id}>
                    {subject.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddGroup} color="primary" variant="contained">
            Create
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupCreate;
