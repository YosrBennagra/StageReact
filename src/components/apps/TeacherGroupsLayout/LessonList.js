import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { fetchGroupLessons } from 'src/store/apps/groups/groupsSlice';

const LessonList = ({ showrightSidebar }) => {
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.groups.lessons);
  const lessonStatus = useSelector((state) => state.groups.status);
  const lessonError = useSelector((state) => state.groups.error);
  const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);

  useEffect(() => {
    dispatch(fetchGroupLessons(currentSelectedGroup));
  }, [dispatch, currentSelectedGroup]);
  console.log('currentSelectedGroup:', currentSelectedGroup);
  console.log('lessonStatus:', lessonStatus);
  console.log('lessonError:', lessonError);
  console.log('lessons:', lessons);
  
  if (lessonStatus === 'loading') {
    return <Typography>Loading lessons...</Typography>;
  }

  if (lessonStatus === 'failed') {
    return <Typography>Please Select Group</Typography>;
  }


  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    return <Typography>No lessons found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Lessons
      </Typography>
      <List>
        {lessons.map((lesson) => (
          <div key={lesson._id}>
            <ListItem>
              <ListItemText primary={lesson.title} secondary={lesson.description} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
};

export default LessonList;
