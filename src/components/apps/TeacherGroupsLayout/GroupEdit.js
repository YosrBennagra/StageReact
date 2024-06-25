import React, { useState } from 'react';
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
} from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import { IconEdit } from '@tabler/icons';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GroupEdit = ({ group, onUpdateGroup }) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(group.name);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateGroup = async () => {
    const updatedGroup = {
      ...group,
      name: groupName,
    };

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateGroup} color="primary" variant="contained">
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

export default GroupEdit;
