import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, Typography, Divider, ListItemButton } from '@mui/material';
import { createLesson, fetchGroupLessons } from 'src/store/apps/groups/groupsSlice';
import LessonCreate from './LessonCreate';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const LessonList = ({ onLessonClick  }) => {
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.groups.lessons);
  const lessonStatus = useSelector((state) => state.groups.status);
  const lessonError = useSelector((state) => state.groups.error);
  const currentSelectedGroup = useSelector((state) => state.groups.selectedGroup);
  const user = useAuthUser();

  useEffect(() => {
    if (currentSelectedGroup) {
      dispatch(fetchGroupLessons(currentSelectedGroup));
    }
  }, [dispatch, currentSelectedGroup]);

  const handleAddLesson = (newLesson) => {
    dispatch(createLesson({ ...newLesson, group: currentSelectedGroup })).then(() => {
      dispatch(fetchGroupLessons(currentSelectedGroup));
    });
  };

  if (lessonStatus === 'loading') {
    return <Typography>Loading lessons...</Typography>;
  }

  if (lessonStatus === 'failed') {
    return <Typography>{lessonError || 'Failed to load lessons'}</Typography>;
  }

  return (
    <div>
      {user.role !== 'admin' && user.role !== 'responsable' ? null :
        <LessonCreate onAddLesson={handleAddLesson} />
      }
      {lessons.length === 0 ? (
        <Typography>No lessons found.</Typography>
      ) : (
        <List>
          {lessons.map((lesson) => (
            <div key={lesson._id}>
              <ListItem>
                <ListItemButton onClick={() => onLessonClick(lesson)}>
                  <ListItemText primary={lesson.title} secondary={lesson.description} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </div>
  );
};

export default LessonList;
