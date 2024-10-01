import axios, { Axios } from 'axios';

const apiUrl = axios.create({
    baseURL: 'http://localhost:8080/',
});

export default apiUrl;
