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
} from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const LessonCreate = ({ onAddLesson }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);
  console.log("🚀 ~ file: LessonCreate.js:34 ~ LessonCreate ~ currentSelectedGroup:", currentSelectedGroup);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleInputDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleAddLesson = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('group', currentSelectedGroup); 

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('http://localhost:3001/lessons', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const createdLesson = await response.json();
        onAddLesson(createdLesson); 
        console.log('Successfully added the lesson');
        handleClose();
      } else {
        console.error('Failed to add the lesson');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };


  return (
    <Box>
      <Box p={3} pb={1}>
        <Button variant="contained" fullWidth color="primary" onClick={handleClickOpen}>
          Create Lesson
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
        <DialogTitle id="alert-dialog-slide-title">Create New Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="lesson-title">Lesson Title</CustomFormLabel>
            <TextField
              id="lesson-title"
              fullWidth
              size="small"
              variant="outlined"
              value={title}
              onChange={handleInputTitle}
              helperText="Enter lesson title in the input above"
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <CustomFormLabel htmlFor="lesson-description">Description</CustomFormLabel>
            <CustomTextField
              id="lesson-description"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={description}
              onChange={handleInputDescription}
            />
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description" component="div">
            <Button sx={{ mt: 2 }} variant="contained" color="primary" component="label">
              Upload Files
              <input hidden multiple type="file" onChange={handleFileChange} />
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddLesson} color="primary" variant="contained">
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

export default LessonCreate;
