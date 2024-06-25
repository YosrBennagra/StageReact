import React, { useEffect } from 'react';
import { Autocomplete, CircularProgress } from '@mui/material';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from 'src/store/apps/users/usersSlice';

const AutoCompleteStudents = ({ onInputChange }) => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (status === 'loading') {
        return <CircularProgress />;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <Autocomplete
            id="checkboxes-tags-demo"
            options={users}
            disableCloseOnSelect
            getOptionLabel={(option) =>
                option._id === 'checkboxes-tags-demo placeholder'
                    ? 'Favorites'
                    : `${option.firstname} ${option.lastname} | ${option.email} | ${option.username}`
            }
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <CustomCheckbox style={{ marginRight: 8 }} checked={selected} />
                    {option.firstname} {option.lastname} | {option.email} | {option.username}
                </li>
            )}
            fullWidth
            onChange={onInputChange}
            renderInput={(params) => (
                <CustomTextField {...params} placeholder="Select Student" aria-label="Select Student" />
            )}
        />
    );
};

export default AutoCompleteStudents;
