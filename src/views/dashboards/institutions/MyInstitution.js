import { Avatar, AvatarGroup, Box, Button, Chip, FormControlLabel, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { IconCheck, IconChecks } from '@tabler/icons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox'
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField'
import ChildCard from 'src/components/shared/ChildCard'
import InlineItemCard from 'src/components/shared/InlineItemCard'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'
import { basicsTableData } from 'src/views/tables/tableData'

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


  const [responsables, setReponsables] = useState([]);
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/institutions/${InstitutionId}`);
        console.log(response.data);
        setReponsables(response.data.responsables);
        console.log("responsables", responsables);
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
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8} sx={{ mt: '20px' }}>
          <ParentCard title='Ordrinary Form'>
            <form>
              <CustomFormLabel htmlFor="email-address">Subject Name</CustomFormLabel>
              <CustomTextField id="email-address" variant="outlined" fullWidth />

              <CustomFormLabel htmlFor="ordinary-outlined-password-input">Coefficient</CustomFormLabel>
              <CustomTextField
                id="ordinary-outlined-password-input"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                sx={{ mb: '10px' }}
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
                sx={{ mb: 1 }}
              />

              <Button color="primary" variant="contained">
                Submit
              </Button>
            </form>
          </ParentCard>
        </Grid>

        <Grid item xs={12} sm={4} sx={{ mt: '20px' }} display={'flex'}>
          <ChildCard title="Custom outlined Icon">
            <InlineItemCard>
              {responsables ? (
                responsables.map((responsable) => (
                  <Chip
                    key={responsable.id}
                    label={responsable.name}
                    variant="outlined"
                    color="primary"
                    avatar={<Avatar width="35">{responsable.name[0]}</Avatar>}
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
                    <Typography variant="h6">Users</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Project Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Team</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Budget</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {basicsTableData.map((basic) => (
                  <TableRow key={basic.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Avatar src={basic.imgsrc} alt={basic.imgsrc} width="35" />
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {basic.name}
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle2">
                            {basic.post}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {basic.pname}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <AvatarGroup max={4}>
                          {basic.teams.map((team) => (
                            <Avatar
                              key={team.id}
                              width="35"
                              sx={{
                                bgcolor: team.color,
                              }}
                            >
                              {team.text}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        sx={{
                          bgcolor:
                            basic.status === 'Active' ? (theme) => theme.palette.success.light :
                              basic.status === 'Pending' ? (theme) => theme.palette.warning.light :
                                basic.status === 'Completed' ? (theme) => theme.palette.primary.light :
                                  basic.status === 'Cancel' ? (theme) => theme.palette.error.light :
                                    (theme) => theme.palette.secondary.light,
                          color:
                            basic.status === 'Active' ? (theme) => theme.palette.success.main :
                              basic.status === 'Pending' ? (theme) => theme.palette.warning.main :
                                basic.status === 'Completed' ? (theme) => theme.palette.primary.main :
                                  basic.status === 'Cancel' ? (theme) => theme.palette.error.main :
                                    (theme) => theme.palette.secondary.main,
                          borderRadius: "8px"
                        }}
                        size="small"
                        label={basic.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">${basic.budget}k</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

    </>
  )
}
