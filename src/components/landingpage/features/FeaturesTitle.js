import React from 'react';
import { Grid, Typography } from '@mui/material';


const FeaturesTitle = () => {

    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={10} lg={6}>
                <Typography fontSize="16" textTransform="uppercase" color="primary.main" fontWeight={500} textAlign="center" mb={1}>What we offer</Typography>
                <Typography variant='h2' fontWeight={700} textAlign="center" sx={{
                    fontSize: {
                        lg: '36px',
                        xs: '25px'
                    },
                    lineHeight: {
                        lg: '43px',
                        xs: '30px'
                    }
                }}> Amazing features like</Typography>
            </Grid>
        </Grid>
    );
};

export default FeaturesTitle;
