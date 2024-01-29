import axios from 'axios';

const VUE_APP_API_BASE_URL= "http://localhost:3000"
const API_BASE_URL = VUE_APP_API_BASE_URL;

const getTrainers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/trainers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

const createTrainer = async (trainerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/trainers`, trainerData);
    return response.data;
  } catch (error) {
    console.error('Error creating trainer:', error);
    throw error;
  }
};

const updateTrainer = async (trainerName, trainerData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/trainers/${trainerName}`, trainerData);
    return response.data;
  } catch (error) {
    console.error('Error updating trainer:', error);
    throw error;
  }
};

const fetchTrainerInfo = async (trainerName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/trainers/${trainerName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trainer info:', error);
    throw error;
  }
};

export { getTrainers, createTrainer, updateTrainer, fetchTrainerInfo };