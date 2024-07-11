import React, { useState, useEffect } from 'react';
import {
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  TextField,
  Typography,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import './Calendar.css';
import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb';
import { IconCheck } from '@tabler/icons';
import BlankCard from '../../../components/shared/BlankCard';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './event-api'

moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const BigCalendar = () => {
  const [calevents, setCalEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slot, setSlot] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [color, setColor] = useState('default');
  const [update, setUpdate] = useState();

  useEffect(() => {
    console.log('Component mounted');
    const loadEvents = async () => {
      try {
        console.log('Fetching events...');
        const events = await fetchEvents();
        console.log('Events fetched:', events);
        setCalEvents(events);
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        console.log('DATEEEEEE', new Date(y, m, 5))
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    loadEvents();
  }, []);

  const ColorVariation = [
    { id: 1, eColor: '#1a97f5', value: 'default' },
    { id: 2, eColor: '#39b69a', value: 'green' },
    { id: 3, eColor: '#fc4b6c', value: 'red' },
    { id: 4, eColor: '#615dff', value: 'azure' },
    { id: 5, eColor: '#fdd43f', value: 'warning' },
  ];

  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);
    console.log('Adding new event:', slotInfo);
  };

  const editEvent = (event) => {
    setOpen(true);
    const newEditEvent = calevents.find((elem) => elem.title === event.title);
    setColor(event.color);
    setTitle(newEditEvent.title);
    setColor(newEditEvent.color);
    setStart(newEditEvent.start);
    setEnd(newEditEvent.end);
    setUpdate(event);
    console.log('Editing event:', event);
  };

  const updateEventInBackend = async (id, updatedEvent) => {
    try {
      const updated = await updateEvent(id, updatedEvent);
      setCalEvents((prevEvents) =>
        prevEvents.map((event) => (event.title === updated.title ? updated : event))
      );
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEventFromBackend = async (id) => {
    try {
      await deleteEvent(id);
      setCalEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
      handleClose();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setStart(new Date());
    setEnd(new Date());
    setUpdate(null);
  };

  const handleStartChange = (newValue) => {
    setStart(newValue);
  };

  const handleEndChange = (newValue) => {
    setEnd(newValue);
  };
  console.log('Rendering BigCalendar component...', start, end);

  const inputChangeHandler = (e) => {
    setTitle(e.target.value);
  };

  const selectInputChangeHandler = (id) => {
    setColor(id);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const newEvent = { title, start, end, color };
    try {
      const createdEvent = await createEvent(newEvent);
      setCalEvents([...calevents, createdEvent]);
      setOpen(false);
      setTitle('');
      setStart(new Date());
      setEnd(new Date());
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }
    return { className: 'event-default' };
  };

  return (
    <PageContainer title="Calendar UI" description="This is the Calendar page">
      <Breadcrumb title="Calendar" subtitle="App" />
      <BlankCard key={slot} variant="outlined">
        <CardContent>
          <DnDCalendar
            selectable
            events={calevents}
            defaultView="week"
            scrollToTime={new Date(1970, 1, 1, 8)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px)' }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
            min={new Date(1970, 1, 1, 8)}
            max={new Date(1970, 1, 1, 18)}
            resizable
            onEventResize={(data) =>
              updateEventInBackend(data.event._id, {
                start: data.start,
                end: data.end,
              })
            }
            onEventDrop={(data) =>
              updateEventInBackend(data.event._id, {
                start: data.start,
                end: data.end,
              })
            }
          />
        </CardContent>
      </BlankCard>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={submitHandler}>
          <DialogContent>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {update ? 'Update Event' : 'Add Event'}
            </Typography>
            <TextField
              id="event-title"
              placeholder="Enter Event Title"
              variant="outlined"
              fullWidth
              label="Event Title"
              value={title}
              sx={{ mb: 3 }}
              onChange={inputChangeHandler}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Start Date"
                inputFormat="MM/dd/yyyy"
                value={start}
                onChange={handleStartChange}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 3 }} />}
              />
              <MobileDatePicker
                label="End Date"
                inputFormat="MM/dd/yyyy"
                value={end}
                onChange={handleEndChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{ mb: 3 }}
                    error={start > end}
                    helperText={start > end ? 'End date must be later than start date' : ''}
                  />
                )}
              />
            </LocalizationProvider>
            <Typography variant="h6" fontWeight={600} my={2}>
              Select Event Color
            </Typography>
            {ColorVariation.map((mcolor) => (
              <Fab
                color="primary"
                style={{ backgroundColor: mcolor.eColor }}
                sx={{
                  marginRight: '3px',
                  transition: '0.1s ease-in',
                  scale: mcolor.value === color ? '0.9' : '0.7',
                }}
                size="small"
                key={mcolor.id}
                onClick={() => selectInputChangeHandler(mcolor.value)}
              >
                {mcolor.value === color ? <IconCheck /> : ''}
              </Fab>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" onClick={submitHandler}>
              {update ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BigCalendar;
