import axios, { AxiosError, AxiosInstance } from "axios";

// Criar instância da API
const api: AxiosInstance = axios.create({
	baseURL: 'https://maxcamapi-production.up.railway.app',
	timeout: 50000,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Verificar se a instância foi criada corretamente
if (!api) {
	throw new Error('Falha ao criar instância da API');
}

console.log('API criada com sucesso:', api.defaults.baseURL);

// Interceptor para tratamento de erros de resposta
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		console.error('Erro na requisição:', error);

		if (error.code === 'ECONNABORTED') {
			throw new Error('Tempo limite excedido. Verifique sua conexão.');
		}

		if (error.code === 'ERR_NETWORK') {
			throw new Error('Erro de conexão. Verifique sua internet.');
		}

		if (error.response?.status === 401) {
			throw new Error('Sessão expirada. Faça login novamente.');
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

// Exportar tanto como default quanto como named export para compatibilidade
export { api };
export default api;