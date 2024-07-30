import { Avatar, Box, Button, Chip, FormControlLabel, Grid, Input, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { useParams } from 'react-router'

import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox'
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField'
import ChildCard from 'src/components/shared/ChildCard'
import InlineItemCard from 'src/components/shared/InlineItemCard'
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
  const { InstitutionId } = useParams()



  const [responsables, setReponsables] = useState();
  const [subjects, setSubjects] = useState([]);
  const [isDep, setIsDep] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [institution, setInstitution] = useState('')
  const [newCoef, setNewCoef] = useState(0);
  const user = useAuthUser();
  const [newInstitutionName, setNewInstitutionName] = useState('');
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    setIsDep(!isDep);
  };
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/institutions/${InstitutionId}`);
        const response2 = await axios.get(`http://localhost:3001/subjects/getsubjectsBy/${InstitutionId}`);
        const responseUser = await axios.get(`http://localhost:3001/userinfos/byIns/${InstitutionId}`);
        setInstitution(response.data)
        setReponsables(responseUser.data);
        if (response2.data) {
          setSubjects(response2.data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error('Error fetching institution:', error);
      }
    };

    fetchInstitution();
  }, [InstitutionId]);

  const handleAddSubject = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/subjects`, {
        name: newSubject,
        coefficient: newCoef,
        institution: InstitutionId
      });
      setSubjects([...subjects, response.data]);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleDeleteResponsable = async (resId) => {
    try {
      await axios.delete(`http://localhost:3001/users/deleteuser/${resId}`);
      await axios.delete(`http://localhost:3001/userinfos/user/${resId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleteing responsable:', error);
    }
  };
  const handleUpdateInstitution = async (newInstitutionName) => {
    try {
      const response = await axios.put(`http://localhost:3001/institutions/${institution._id}`, {
        name: newInstitutionName,
      });
      setInstitution(response.data);
    } catch (error) {
      console.error('Error updating institution:', error);
    }
  };
  
  return (
    <>
      <Breadcrumb title="My Institution" items={BCrumb}>
        <Box>
          <img width={'165px'} />
        </Box>
      </Breadcrumb>
      <CustomFormLabel htmlFor="institution">Institution Name :</CustomFormLabel>
      <CustomTextField variant="outlined" value={institution.name} onChange={(e) => handleUpdateInstitution(e.target.value)}></CustomTextField>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8} sx={{ mt: '20px' }}>
          <ParentCard title='Add a subject'>
            <form>
              <CustomFormLabel htmlFor="email-address">Subject Name</CustomFormLabel>
              <CustomTextField id="email-address" variant="outlined" fullWidth onChange={(e) => setNewSubject(e.target.value)} />

              <CustomFormLabel >Coefficient</CustomFormLabel>
              <CustomTextField
                type="number"
                variant="outlined"
                fullWidth
                sx={{ mb: '10px' }}
                onChange={(e) => setNewCoef(e.target.value)}
              />
              {
                isDep ?
                  <>
                    <CustomFormLabel htmlFor="email-address" >Departement Name</CustomFormLabel>
                    <CustomTextField variant="outlined" fullWidth />
                  </> :
                  null
              }
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
                sx={{ mb: 1 }}
              />
              <br />


              <Button color="primary" variant="contained" onClick={handleAddSubject}>
                Submit
              </Button>
            </form>
          </ParentCard>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ mt: '20px' }} display={'flex'}>
          <ChildCard title="Responsables of the institution" >
            <InlineItemCard >
              {responsables ? (
                responsables.map((responsable) => (
                  <Chip
                    key={responsable.user._id}
                    label={responsable.user.username}
                    variant="outlined"
                    color="primary"
                    avatar={<Avatar width="35"  >{responsable.user.username.charAt(0)}</Avatar>}
                    onDelete={user.role === 'admin' ? () => handleDeleteResponsable(responsable.user._id) : undefined}
                  />
                ))
              ) : (
                <Typography>No responsables available</Typography>
              )}
            </InlineItemCard>
          </ChildCard>
        </Grid>

        <Grid item xs={12} sx={{ mt: '20px' }}>
          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>

                  <TableCell>
                    <Typography variant="h6">Subject Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Coeficient</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Departement</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects && subjects.length > 0 ? (
                  subjects.map((basic) => (
                    <TableRow key={basic.id}>
                      <TableCell>
                        <Typography variant="h6" fontWeight="600">
                          {basic.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {basic.coefficient}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                          {basic.departement ? basic.departement : 'No department'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography>No subjects available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

    </>
  );
}