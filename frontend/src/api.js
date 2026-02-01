import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = {
    getLocalities: async () => {
        const response = await axios.get(`${API_URL}/localities`);
        return response.data;
    },

    getBaseline: async (locality) => {
        const response = await axios.get(`${API_URL}/locality/${locality}/baseline`);
        return response.data;
    },

    predict: async (payload) => {
        const response = await axios.post(`${API_URL}/predict`, payload);
        return response.data;
    },

    chat: async (message, context) => {
        const response = await axios.post(`${API_URL}/chat`, { message, context });
        return response.data;
    }
};
