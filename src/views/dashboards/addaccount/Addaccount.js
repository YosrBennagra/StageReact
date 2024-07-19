import { Box, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import PageContainer from 'src/components/container/PageContainer'
import Logo from 'src/layouts/full/shared/logo/Logo'
import AuthRegister from 'src/views/authentication/authForms/AuthRegister'

export default function Addaccount() {
    return (
        <PageContainer title="Register" description="this is Register page">
            <Grid  container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}  >
                    <Box width={'30%'} p={3}>
                        <AuthRegister />
                    </Box>
            </Grid>
        </PageContainer>
    )
}
