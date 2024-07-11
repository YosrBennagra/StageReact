import { Card } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from 'src/store/apps/groups/groupsSlice';

export default function DashboardSalary() {
    const dispatch = useDispatch();
    const [groups, setGroups] = useState([]);
    const allGroups = useSelector((state) => state.groups.groups);

    useEffect(() => {
        setGroups(dispatch(fetchGroups()));
    }, [dispatch]);
    useEffect(() => {
        setGroups(allGroups);
    }, [allGroups]);

    return (
        <div>{groups.map((group) => <Card key={group.id} group={group} />)}</div>
    )
}
