import axios from 'axios';

const BASE_URL = "http://127.0.0.1:8000/api";

export const fetchWeatherData = async (city) => {
  const response = await axios.get(`${BASE_URL}/weather/?city=${city}`);
  return response.data;
};
