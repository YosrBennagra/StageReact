import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Link, Divider, Grid, Stack, Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import { IconDownload, IconPigMoney } from '@tabler/icons';

const EmailContent = ({ lesson }) => {
  const [fileInfos, setFileInfos] = useState({});

  useEffect(() => {
    const fetchFileInfos = async () => {
      if (lesson && lesson.files) {
        const fetchedFileInfos = {};
        await Promise.all(
          lesson.files.map(async (file) => {
            const response = await axios.get(`http://localhost:3001/attachment/files/info/${file}`);
            fetchedFileInfos[file] = response.data.file;
          })
        );
        setFileInfos(fetchedFileInfos);
      }
    };
    fetchFileInfos();
  }, [lesson]);

  if (!lesson) {
    return (
      <Box p={2}>
        <Typography variant="h6">Select a lesson to view details</Typography>
      </Box>
    );
  }
  const handleDownload = (file) => {

    const link = document.createElement('a');
    link.href = `http://localhost:3001/attachment/files/download/${file}`;
    link.download = '';
    link.click();
  };
  return (
    <Box p={2}>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4">{lesson.title}</Typography>
      </Box>
      <Box sx={{ py: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
      </Box>
      <Divider />

      {lesson.files && lesson.files.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6">Attachments ({lesson?.files?.length})</Typography>
          <List>
            {lesson.files.map((file) => (
              <ListItem key={file}>
                <ListItemText
                  primary={
                    <Link href={`http://localhost:3001/attachment/files/${file}`} target="_blank" rel="noopener noreferrer">
                      {fileInfos[file]?.filename || 'Loading...'}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Grid container spacing={3}>
            {lesson.files?.map((file) => {
              return (
                <Grid item lg={4} key={file.id}>
                  <Stack direction="row" gap={2} mt={2} minWidth={'max-content'}>
                    <IconButton onClick={() => handleDownload(file)}>
                      <IconDownload />
                    </IconButton>
                    <Box mr={'auto'}>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        {fileInfos[file]?.filename || 'Loading...'}
                      </Typography>
                      <Typography variant="body2">{fileInfos[file]?.chunkSize || 'Loading...'}</Typography>
                    </Box>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default EmailContent;
