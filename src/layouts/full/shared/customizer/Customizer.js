import React, { useState } from 'react';
import {
  Fab,
  Drawer,
  Grid,
  Divider,
  styled,
  Typography,
  Slider,
  Tooltip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Alert,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { IconX, IconSettings, IconCheck, IconPlus } from '@tabler/icons';
import {
  setTheme,
  setDir,
  setDarkMode,
  toggleLayout,
  toggleSidebar,
  toggleHorizontal,
  setBorderRadius,
  setCardShadow,
} from 'src/store/customizer/CustomizerSlice';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import SwipeLeftAltTwoToneIcon from '@mui/icons-material/SwipeLeftAltTwoTone';
import SwipeRightAltTwoToneIcon from '@mui/icons-material/SwipeRightAltTwoTone';
import AspectRatioTwoToneIcon from '@mui/icons-material/AspectRatioTwoTone';
import CallToActionTwoToneIcon from '@mui/icons-material/CallToActionTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import WebAssetTwoToneIcon from '@mui/icons-material/WebAssetTwoTone';
import { ViewComfyTwoTone, PaddingTwoTone, BorderOuter } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

import axios from 'axios';

const SidebarWidth = '320px';

const Customizer = () => {
  /* Institution B */
  const [formDataIns, setFormDataIns] = React.useState({ name: '' });
  const [openins, setOpenIns] = React.useState(false);
  const onSubmitIns = async (event) => {
    event.preventDefault();
    console.log(formDataIns);
    try {
      const response = await axios.post(`http://localhost:3001/institutions`, formDataIns);
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error('Creation error:', error.response.data.message);
    }
  }
  const handleClickOpenInstitution = () => {
    setOpenIns(true);
  };
  const handleCloseIns = () => {
    setOpenIns(false);
  };
   /* Institution E */

  /* Assignment B*/
  const [formData, setFormData] = React.useState({ title: '' });
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`http://localhost:3001/assignments`, formData);
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error('Creation error:', error.response.data.message);
    }
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  /* Assignment E*/

  /* Assignemnt Form */
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state) => state.customizer);
  const location = useLocation();
  console.log(location.pathname);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const StyledBox = styled(Box)(({ theme }) => ({
    boxShadow: theme.shadows[8],
    padding: '20px',
    cursor: 'pointer',
    justifyContent: 'center',
    display: 'flex',
    transition: '0.1s ease-in',
    border: '1px solid rgba(145, 158, 171, 0.12)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

  const thColors = [
    {
      id: 1,
      bgColor: '#5D87FF',
      disp: 'BLUE_THEME',
    },
    {
      id: 2,
      bgColor: '#0074BA',
      disp: 'AQUA_THEME',
    },
    {
      id: 3,
      bgColor: '#763EBD',
      disp: 'PURPLE_THEME',
    },
    {
      id: 4,
      bgColor: '#0A7EA4',
      disp: 'GREEN_THEME',
    },
    {
      id: 5,
      bgColor: '#01C0C8',
      disp: 'CYAN_THEME',
    },
    {
      id: 6,
      bgColor: '#FA896B',
      disp: 'ORANGE_THEME',
    },
  ];
  return (
    <div>
      {/* ------------------------------------------- */}
      {/* --Floating Button to open customizer ------ */}
      {/* ------------------------------------------- */}
      <Tooltip title="Settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: 'fixed', right: '25px', bottom: '15px' }}
          onClick={() => setShowDrawer(true)}
        >
          <IconSettings stroke={1.5} />
        </Fab>
      </Tooltip>

      {/* ------------------------------------------- */}
      {
        location.pathname === '/dashboard/assignments' && (<Tooltip title="Add">
          <Fab
            color="secondary"
            aria-label="plus"
            onClick={handleClickOpen}
            sx={{ position: 'fixed', right: '100px', bottom: '15px' }}>
            <IconPlus width={20} />
          </Fab>
        </Tooltip>)
      }
      {/* Dialog Assignments B*/}
      <>
        <form >
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Creating A New Assignment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please insert below the assignment name.
              </DialogContentText>
              <Box mt={2}>
                <CustomTextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Assignment name"
                  type="text"
                  fullWidth
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  sx={{
                    '& input:valid + fieldset': {
                      borderColor: '#39cb7f',
                    },
                    '& input:invalid + fieldset': {
                      borderColor: '#fc4b6c',
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={handleClose}>Cancel</Button>
              <Button color="success" onClick={onSubmit}>Create</Button>
            </DialogActions>
          </Dialog>
        </form>
      </>
      {/* Dialog Assignments E */}
      {/* ------------------------------------------- */}
      {
        location.pathname === '/dashboard/institutions' && (<Tooltip title="Add an institution">
          <Fab
            color="secondary"
            aria-label="plus"
            onClick={handleClickOpenInstitution}
            sx={{ position: 'fixed', right: '100px', bottom: '15px' }}>
            <IconPlus width={20} />
          </Fab>
        </Tooltip>)
      }
      {/* Dialog Institutions B*/}
      <>
        <form >
          <Dialog open={openins} onClose={handleCloseIns}>
            <DialogTitle>Creating A New Institutions</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please insert below the Institutions name.
              </DialogContentText>
              <Box mt={2}>
                <CustomTextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Institution name"
                  type="text"
                  fullWidth
                  onChange={(e) => setFormDataIns({ ...formDataIns, title: e.target.value })}
                  required
                  sx={{
                    '& input:valid + fieldset': {
                      borderColor: '#39cb7f',
                    },
                    '& input:invalid + fieldset': {
                      borderColor: '#fc4b6c',
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={handleCloseIns}>Cancel</Button>
              <Button color="success" onClick={onSubmitIns}>Create</Button>
            </DialogActions>
          </Dialog>
        </form>
      </>
      {/* Dialog Institutions E */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* ------------ Customizer Sidebar ------------- */}
        {/* ------------------------------------------- */}
        <Scrollbar sx={{ height: 'calc(100vh - 5px)' }}>
          <Box p={2} display="flex" justifyContent={'space-between'} alignItems="center">
            <Typography variant="h4">Settings</Typography>
            <IconButton color="inherit" onClick={() => setShowDrawer(false)}>
              <IconX size="1rem" />
            </IconButton>
          </Box>
          <Divider />
          <Box p={3}>
            {/* ------------------------------------------- */}
            {/* ------------ Dark light theme setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Theme Option
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDarkMode('light'))} display="flex" gap={1}>
                <WbSunnyTwoToneIcon
                  color={customizer.activeMode === 'light' ? 'primary' : 'inherit'}
                />
                Light
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDarkMode('dark'))} display="flex" gap={1}>
                <DarkModeTwoToneIcon
                  color={customizer.activeMode === 'dark' ? 'primary' : 'inherit'}
                />
                Dark
              </StyledBox>
            </Stack>

            <Box pt={3} />
            {/* ------------------------------------------- */}
            {/* ------------ RTL theme setting -------------*/}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Theme Direction
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDir('ltr'))} display="flex" gap={1}>
                <SwipeLeftAltTwoToneIcon
                  color={customizer.activeDir === 'ltr' ? 'primary' : 'inherit'}
                />{' '}
                LTR
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDir('rtl'))} display="flex" gap={1}>
                <SwipeRightAltTwoToneIcon
                  color={customizer.activeDir === 'rtl' ? 'primary' : 'inherit'}
                />{' '}
                RTL
              </StyledBox>
            </Stack>

            <Box pt={3} />
            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" mb={1} gutterBottom>
              Theme Colors
            </Typography>
            <Grid container spacing={2}>
              {thColors.map((thcolor) => (
                <Grid item xs={4} key={thcolor.id}>
                  <StyledBox onClick={() => dispatch(setTheme(thcolor.disp))}>
                    <Tooltip title={thcolor.disp} placement="top">
                      <Box
                        sx={{
                          backgroundColor: thcolor.bgColor,
                          width: '25px',
                          height: '25px',
                          borderRadius: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                          color: 'white',
                        }}
                        aria-label={thcolor.bgcolor}
                      >
                        {customizer.activeTheme === thcolor.disp ? <IconCheck width={13} /> : ''}
                      </Box>
                    </Tooltip>
                  </StyledBox>
                </Grid>
              ))}
            </Grid>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Horizontal / Vertical ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Layout Type
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(toggleHorizontal(false))} display="flex" gap={1}>
                <ViewComfyTwoTone
                  color={customizer.isHorizontal === false ? 'primary' : 'inherit'}
                />
                Vertical
              </StyledBox>
              <StyledBox onClick={() => dispatch(toggleHorizontal(true))} display="flex" gap={1}>
                <PaddingTwoTone color={customizer.isHorizontal === true ? 'primary' : 'inherit'} />
                Horizontal
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Boxed / Full ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Container Option
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(toggleLayout('boxed'))} display="flex" gap={1}>
                <CallToActionTwoToneIcon
                  color={customizer.isLayout === 'boxed' ? 'primary' : 'inherit'}
                />
                Boxed
              </StyledBox>
              <StyledBox onClick={() => dispatch(toggleLayout('full'))} display="flex" gap={1}>
                <AspectRatioTwoToneIcon
                  color={customizer.isLayout === 'full' ? 'primary' : 'inherit'}
                />
                Full
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Sidebar Color setting ------------- */}
            {/* ------------------------------------------- */}

            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            {customizer.isHorizontal ? (
              ''
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Sidebar Type
                </Typography>
                <Stack direction={'row'} gap={2} my={2}>
                  <StyledBox onClick={() => dispatch(toggleSidebar())} display="flex" gap={1}>
                    <WebAssetTwoToneIcon color={!customizer.isCollapse ? 'primary' : 'inherit'} />
                    Full
                  </StyledBox>
                  <StyledBox onClick={() => dispatch(toggleSidebar())} display="flex" gap={1}>
                    <ViewSidebarTwoToneIcon color={customizer.isCollapse ? 'primary' : 'inherit'} />
                    mini
                  </StyledBox>
                </Stack>
              </>
            )}
            <Box pt={4} />
            <Typography variant="h6" gutterBottom>
              Card With
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setCardShadow(false))} display="flex" gap={1}>
                <BorderOuter color={!customizer.isCardShadow ? 'primary' : 'inherit'} />
                Border
              </StyledBox>
              <StyledBox onClick={() => dispatch(setCardShadow(true))} display="flex" gap={1}>
                <CallToActionTwoToneIcon color={customizer.isCardShadow ? 'primary' : 'inherit'} />
                Shadow
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Theme Border Radius
            </Typography>

            <Slider
              size="small"
              value={customizer.borderRadius}
              aria-label="Small"
              min={4}
              max={24}
              onChange={(event) => dispatch(setBorderRadius(event.target.value))}
              valueLabelDisplay="auto"
            />
          </Box>
        </Scrollbar>
      </Drawer>
    </div>
  );
};

export default Customizer;
