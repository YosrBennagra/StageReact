import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Divider,
  Grid,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
} from '@mui/material';
import { IconStar, IconAlertCircle, IconTrash } from '@tabler/icons';
import { useSelector, useDispatch } from 'react-redux';
import { starEmail, importantEmail, deleteEmail } from '../../../store/apps/email/EmailSlice';
import emailIcon from 'src/assets/images/breadcrumb/emailSv.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../views/forms/quill-editor/Quill.css';

const EmailContent = ({ lesson }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showEditor, setShowEditor] = useState(false);
  const [editorText, setEditorText] = useState('');

  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  const handleReply = () => {
    // Logic for replying to the lesson
    console.log('Replying to lesson:', lesson);
    // Example logic to update state or dispatch action
    setEditorText(`Replying to lesson: ${lesson.title}`);
    setShowEditor(true);
  };

  return lesson ? (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pb: 3 }}>
        <Typography variant="h6">{lesson.title}</Typography>
        <Chip
          label={lesson.description}
          sx={{ ml: 'auto', height: '21px' }}
          color="primary"
          size="small"
        />
      </Box>

      <Divider />

      <Box p={3}>
        {/* Lesson Detail */}
        <Box display="flex" alignItems="center" sx={{ pb: 3 }}>
          <Avatar alt={lesson.title} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">{lesson.title}</Typography>
            <Typography variant="body2">{lesson.description}</Typography>
          </Box>
        </Box>
        {/* End of Lesson Detail */}

        <Box sx={{ py: 2 }}>
          <Typography variant="h4">Lesson Details</Typography>
        </Box>

        <Box sx={{ py: 2 }}>
          <Typography variant="body1">{lesson.details}</Typography>
        </Box>
      </Box>

      {/* Attachments Section */}
      {lesson.files && lesson.files.length > 0 && (
        <>
          <Divider />
          <Box p={3}>
            <Typography variant="h6">Attachments ({lesson.files.length})</Typography>

            <Grid container spacing={3}>
              {lesson.files.map((file) => (
                <Grid item lg={4} key={file._id}>
                  <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: '48px',
                        height: '48px',
                        bgcolor: theme.palette.grey[100],
                      }}
                    >
                      {/* Replace with actual file icon or image */}
                      <Avatar
                        src={file.image}
                        alt="File Icon"
                        variant="rounded"
                        sx={{ width: '24px', height: '24px' }}
                      />
                    </Avatar>
                    <Box ml={2}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {file.title}
                      </Typography>
                      <Typography variant="body2">{file.size}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider />
        </>
      )}

      <Box p={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button variant="outlined" size="small" color="primary" onClick={handleReply}>
            Reply
          </Button>
          {/* Add logic for forward functionality */}
          <Button variant="outlined" size="small">
            Forward
          </Button>
        </Box>

        {/* Editor */}
        {showEditor && (
          <Box mt={3}>
            <Paper variant="outlined">
              <ReactQuill
                value={editorText}
                onChange={(value) => {
                  setEditorText(value);
                }}
                placeholder="Type your reply here..."
              />
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <Box p={3} height="50vh" display="flex" justifyContent="center" alignItems="center">
      {/* Placeholder when no lesson is selected */}
      <Box>
        <Typography variant="h4">Please Select a Lesson</Typography>
        <br />
        <img src={emailIcon} alt="Email Icon" width={'250px'} />
      </Box>
    </Box>
  );
};

export default EmailContent;
