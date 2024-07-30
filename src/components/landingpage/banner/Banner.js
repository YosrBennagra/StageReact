import { Box, Container, Grid } from '@mui/material';
import BannerContent from './BannerContent';

const Banner = () => {
  return (
    <Box mb={10} sx={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid item >
            <Box display="flex" justifyContent="center" alignItems="center">
              <BannerContent />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;
