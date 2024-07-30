import React from 'react';
import {
  AppBar,
  styled,
  Toolbar,
  Container,
  Box,
  Stack,
  Drawer,
} from '@mui/material';

import Navigations from './Navigations';


const LpHeader = () => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
      minHeight: '80px',
    },
    backgroundColor: theme.palette.background.default,
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    color: theme.palette.text.secondary,
  }));

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [y, setY] = React.useState(window.scrollY);

  const handleNavigation = React.useCallback(
    (e) => {
      const window = e.currentTarget;
      setY(window.scrollY);
    },
    [y],
  );

  React.useEffect(() => {
    setY(window.scrollY);
    window.addEventListener('scroll', handleNavigation);

    return () => {
      window.removeEventListener('scroll', handleNavigation);
    };
  }, [handleNavigation]);

  return (
    <AppBarStyled position="sticky" elevation={y ? 8 : 0}>
      <Container maxWidth="lg">
        <ToolbarStyled>
          <Box flexGrow={1} />
          <Stack spacing={1} direction="row" alignItems="center">
            <Navigations />
          </Stack>
        </ToolbarStyled>
      </Container>
      <Drawer
        anchor="left"
        open={open}
        variant="temporary"
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 270,
            border: '0 !important',
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
      >

      </Drawer>
    </AppBarStyled>
  );
};

export default LpHeader;
