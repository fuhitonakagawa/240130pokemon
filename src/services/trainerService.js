import axios from 'axios';

// const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
// const API_BASE_URL = VUE_APP_API_BASE_URL;
const API_BASE_URL ="https://bts8ptwbf5.eu-west-3.awsapprunner.com";

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

const deleteTrainer = async (trainerName) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/trainers/${trainerName}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting trainer:", error);
    throw error;
  }
};


export { getTrainers, createTrainer, updateTrainer, fetchTrainerInfo, deleteTrainer };