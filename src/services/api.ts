import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
	baseURL: 'http://maxcamapi-production.up.railway.app',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}
});