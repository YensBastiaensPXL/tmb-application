import axios from "axios";
const API_URL = 'http://192.168.X.X:8080';

export async function login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/api/login`, {
        username,
        password
    });
    return response.data;
}

export async function getAccountDetails(token: string) {
    const response = await axios.get(`${API_URL}/api/account`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}