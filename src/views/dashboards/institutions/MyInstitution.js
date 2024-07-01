import { Box, Button, FormControlLabel } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox'
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

export default function MyInstitution() {
  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/admin/dashboard',
      title: 'Dashboard',
    },
    {
      title: 'My Institutions',
    },
  ];

  const [state, setState] = React.useState({
    checkedB: false,
  });
  const {InstitutionId} = useParams()

  const [institution, setInstitution] = useState(null);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/institutions/${InstitutionId}`);
        console.log(response.data);
        setInstitution(response.data); 
      } catch (error) {
        console.error('Error fetching institution:', error);
      }
    };

    fetchInstitution();
  }, [InstitutionId]);
  return (
    <>
      <Breadcrumb title="My Institution" items={BCrumb}>
        <Box>
          <img width={'165px'} />
        </Box>
      </Breadcrumb>
      <ParentCard title='Ordrinary Form'>
        <form>
          <CustomFormLabel
            sx={{
              mt: 0,
            }}
            htmlFor="email-address"
          >
            Subject Name
          </CustomFormLabel>
          <CustomTextField
            id="email-address"
            variant="outlined"
            fullWidth
          />
          <CustomFormLabel htmlFor="ordinary-outlined-password-input">Coeficient</CustomFormLabel>

          <CustomTextField
            id="ordinary-outlined-password-input"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            sx={{
              mb: '10px',
            }}
          />
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={state.checkedB}
                onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Add a department"
            sx={{
              mb: 1,
            }}
          />
          <div>
            <Button color="primary" variant="contained">
              Submit
            </Button>
          </div>
        </form>
      </ParentCard>
    </>
  )
}
