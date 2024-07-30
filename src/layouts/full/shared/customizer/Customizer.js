import React from 'react';
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions
} from '@mui/material';
import Box from '@mui/material/Box';
import { IconPlus } from '@tabler/icons';
import { useLocation } from 'react-router';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import axios from 'axios';


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

  const location = useLocation();
  console.log(location.pathname);
  const [open, setOpen] = React.useState(false);



  return (
    <div>
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
                  onChange={(e) => setFormDataIns({ ...formDataIns, name: e.target.value })}
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
    </div>
  );
};

export default Customizer;
