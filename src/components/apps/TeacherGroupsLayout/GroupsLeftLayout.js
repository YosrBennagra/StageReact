import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListItemText,
  ListItemButton,
  List,
  Divider,
  ListItemIcon,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import {
  IconEdit,
  IconFolder,
  IconTrash,
} from '@tabler/icons';

import GroupCreate from './GroupCreate';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { fetchGroupMembers, fetchGroups, selectGroup } from 'src/store/apps/groups/groupsSlice';
import axios from 'axios';
import GroupEdit from './GroupEdit';

const GroupsLeftLayout = () => {
  const customizer = useSelector((state) => state.customizer);
  const br = `${customizer.borderRadius}px`;
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const allGroups = useSelector((state) => state.groups.groups);
  const active = useSelector((state) => state.groups.selectedGroup);

  const user = useAuthUser()

  useEffect(() => {
    dispatch(fetchGroups()); 
  }, [dispatch]);

  useEffect(() => {
    setGroups(allGroups);
  }, [allGroups]);

  const handleGroupClick = (group) => {
    dispatch(selectGroup(group._id));
    dispatch(fetchGroupMembers(group._id));
  };

  const handleAddGroup = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };
  const handleUpdateGroup = (updatedGroup) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => (group._id === updatedGroup._id ? updatedGroup : group))
    );
  };

  const handleDeleteGroup = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/groups/${id}`);
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group._id !== id)
      );
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };



  return (
    <>
      {
        (user.role === 'admin' || user.role === 'responsable') ?
          <>
            <Box>
              <GroupCreate onAddGroup={handleAddGroup} />
            </Box>
            < Divider sx={{ mt: 1 }} />
          </>
          : null
      }
      <List>
        <Scrollbar sx={{ height: { lg: 'calc(100vh - 100px)', md: '100vh' }, maxHeight: '800px' }}>
          <Typography variant="subtitle2" my={1} pl={4} fontWeight={600}>
            Groups:
          </Typography>
          <Divider sx={{ my: 0 }} />
          {groups.map((group) => (
            <ListItemButton
              selected={active === group._id}
              key={group._id}
              sx={{ my: 1, px: '20px', mx: 3, borderRadius: br }}
              onClick={() => handleGroupClick(group)}
            >
              <ListItemIcon sx={{ minWidth: '30px', color: group.color }}>
                <IconFolder />
              </ListItemIcon >
              <ListItemText sx={{ textTransform: 'capitalize' }} >{group.name}</ListItemText>
              <GroupEdit group={group} onUpdateGroup={handleUpdateGroup} />
              <Box sx={{ width: '1px', height: '24px', backgroundColor: 'grey', mx: 1 }} />
              <IconButton onClick={() => handleDeleteGroup(group._id)}>
                <IconTrash />
              </IconButton>
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
        </Scrollbar>
      </List>
    </>
  );
};


export default GroupsLeftLayout;
