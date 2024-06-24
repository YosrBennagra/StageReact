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

const GroupsLeftLayout = () => {
  const customizer = useSelector((state) => state.customizer);
  const br = `${customizer.borderRadius}px`;
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const allGroups = useSelector((state) => state.groups.groups);
  const active = useSelector((state) => state.groups.selectedGroup);
  console.log("active", active)
  const user = useAuthUser()
  console.log("auth", user)
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
              <IconEdit />
              <IconTrash/>
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
        </Scrollbar>
      </List>
    </>
  );
};


export default GroupsLeftLayout;
