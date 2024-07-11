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
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { IconEdit } from '@tabler/icons';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GroupEdit = ({ group, onUpdateGroup }) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthUser();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/subjects/getsubjectsBy/${user.institution}`);
        setSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectChange = (event) => {
    setSubjectId(event.target.value);
  };

  const handleUpdateGroup = async () => {
    const updatedGroup = {
      ...group,
      name: groupName,
      subject: subjectId,
    };
    console.log("🚀 ~ file: GroupEdit.js:60 ~ handleUpdateGroup ~ subjectId:", subjectId);

    try {
      const response = await fetch(`http://localhost:3001/groups/${group._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGroup),
      });

      if (response.ok) {
        const result = await response.json();
        onUpdateGroup(result);
        handleClose();
      } else {
        console.error('Failed to update the group');
      }
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleInputChange = (event) => {
    setGroupName(event.target.value);
  };

  return (
    <Box>
      <IconButton onClick={handleClickOpen}>
        <IconEdit />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Update Group</DialogTitle>
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
              helperText="Change group name in the input above"
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="select-subject">Assign a subject</CustomFormLabel>
            <Select
              labelId="select-subject-label"
              id="select-subject"
              value={subjectId}
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
          <Button onClick={handleUpdateGroup} color="primary" variant="contained">
            Update
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupEdit;
