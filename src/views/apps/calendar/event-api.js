import axios from "axios";


const API_URL = 'http://localhost:3001/events';

export const fetchEvents = async () => {
  const response = await axios.get(API_URL);
  console.log('Fetched events from API:', response.data);
  return response.data;
};

export const createEvent = async (event) => {
  const response = await axios.post(API_URL, event);
  console.log('Created event via API:', response.data);
  return response.data;
};

export const updateEvent = async (id, event) => {
  const response = await axios.put(`${API_URL}/${id}`, event);
  console.log('Updated event via API:', response.data);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  console.log('Deleted event via API:', response.data);
  return response.data;
};
