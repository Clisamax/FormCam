import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosError, AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
	baseURL: 'http://localhost:3338',
	timeout: 10000, // Aumentado para 10 segundos
	headers: {
		'Content-Type': 'application/json'
	}
});

// Interceptor para verificar conectividade antes das requisições
api.interceptors.request.use(
	async (config) => {
		const netInfo = await NetInfo.fetch();

		if (!netInfo.isConnected) {
			throw new Error('Sem conexão com a internet');
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para tratamento de erros de resposta
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.code === 'ECONNABORTED') {
			// Timeout
			throw new Error('Tempo limite excedido. Verifique sua conexão.');
		}

		if (error.code === 'ERR_NETWORK') {
			// Erro de rede
			throw new Error('Erro de conexão. Verifique sua internet.');
		}

		if (error.response?.status === 401) {
			// Não autorizado
			throw new Error('Sessão expirada. Faça login novamente.');
		}

		if (error.response?.status === 500) {
			// Erro do servidor
			throw new Error('Erro interno do servidor. Tente novamente.');
		}

		// Outros erros
		throw error;
	}
);

export default api;