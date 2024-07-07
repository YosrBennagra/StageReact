import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

export default function DashboardInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const BCrumb = [
    {
      to: '/',
      title: 'Dashboard',
    },
    {
      title: 'Institutions',
    },
  ];
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get('http://localhost:3001/institutions/');
        setInstitutions(response.data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchInstitution();
  }, []);

  return (
    <PageContainer title="Basic Table" description="this is Basic Table page">
      <Breadcrumb title="Institutions" items={BCrumb} />
      <ParentCard title="Institutions table">
        <Paper variant="outlined">

          <TableContainer>
            <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Institution Name</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {institutions.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {institution.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
}
