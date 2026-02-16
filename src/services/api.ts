import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from "axios";

// Criar instância da API
const api: AxiosInstance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Verificar se a instância foi criada corretamente
if (!api) {
	throw new Error('Falha ao criar instância da API');
}

console.log('API criada com sucesso:', api.defaults.baseURL);

// Interceptor para renovar o timestamp de sessão a cada requisição
api.interceptors.request.use(
	async (config) => {
		try {
			// Não atualiza o timestamp se for a requisição de login para evitar conflitos
			if (config.url !== '/api/v1/login') {
				const now = Date.now();
				await AsyncStorage.setItem('@auth:timestamp', now.toString());
			}
		} catch (error) {
			console.error('Erro ao atualizar timestamp de sessão:', error);
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
	async (error: AxiosError) => {
		const originalRequest = error.config;

		if (!originalRequest) {
			return Promise.reject(error);
		}

		// @ts-ignore
		const retryCount = originalRequest._retryCount || 0;
		const maxRetries = 10;
		const maxAuthRetries = 5; // Menos tentativas para 401 no login
		const retryDelay = 4000;

		const isLoginRoute = originalRequest.url === '/api/v1/login';

		// Condição para tentar novamente:
		// 1. Erros de rede/timeout/502 (até 10 vezes)
		// 2. Erro 401 especificamente no login (até 3 vezes) para contornar problemas de "primeiro login"
		const shouldRetry =
			(error.code === 'ECONNABORTED' ||
				error.code === 'ERR_NETWORK' ||
				error.response?.status === 502 ||
				(error.response?.status === 401 && isLoginRoute)) &&
			retryCount < (error.response?.status === 401 ? maxAuthRetries : maxRetries);

		if (shouldRetry) {
			// @ts-ignore
			originalRequest._retryCount = retryCount + 1;

			const reason = error.response?.status === 401 ? 'Autenticação' : 'Conexão';
			console.log(
				`Problema de ${reason}. Tentativa ${retryCount + 1} de ${error.response?.status === 401 ? maxAuthRetries : maxRetries
				}...`
			);

			return new Promise((resolve) => {
				setTimeout(() => resolve(api(originalRequest)), retryDelay);
			});
		}

		console.error('Erro na requisição:', error);

		if (error.code === 'ECONNABORTED') {
			throw new Error('Tempo limite excedido. Verifique sua conexão.');
		}

		if (error.code === 'ERR_NETWORK') {
			throw new Error('Erro de conexão. Verifique sua internet.');
		}

		if (error.response?.status === 401) {
			if (isLoginRoute) {
				throw new Error('Usuário ou senha incorretos.');
			}
			// @ts-ignore
			const serverMessage = error.response?.data?.message;
			throw new Error(serverMessage || 'Sessão expirada. Faça login novamente.');
		}

		if (error.response?.status === 502) {
			throw new Error(
				'O servidor não conseguiu responder. Tente novamente mais tarde.'
			);
		}

		if (error.response?.status === 500) {
			throw new Error('Erro interno do servidor. Tente novamente.');
		}

		throw error;
	}
);

// Verificar se a instância tem o método post
if (typeof api.post !== 'function') {
	throw new Error('Método post não está disponível na instância da API');
}

// Exportar tanto como default quanto como name export para compatibilidade
export { api };
export default api;