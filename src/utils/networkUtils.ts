import { api } from '@/services/api';
import NetInfo from '@react-native-community/netinfo';

export interface NetworkTestResult {
	isConnected: boolean;
	isInternetReachable: boolean;
	serverReachable: boolean;
	responseTime?: number;
	error?: string;
}

/**
 * Testa a conectividade completa da rede
 */
export const testNetworkConnectivity = async (): Promise<NetworkTestResult> => {
	const result: NetworkTestResult = {
		isConnected: false,
		isInternetReachable: false,
		serverReachable: false,
	};

	try {
		// 1. Verificar conectividade básica
		const netInfo = await NetInfo.fetch();
		result.isConnected = netInfo.isConnected ?? false;
		result.isInternetReachable = netInfo.isInternetReachable ?? false;

		if (!result.isConnected) {
			result.error = 'Dispositivo não está conectado à rede';
			return result;
		}

		if (!result.isInternetReachable) {
			result.error = 'Internet não está acessível';
			return result;
		}

		// 2. Testar conectividade com o servidor
		const startTime = Date.now();
		try {
			await api.get('/health'); // Endpoint de health check (se existir)
			result.serverReachable = true;
			result.responseTime = Date.now() - startTime;
		} catch (error) {
			// Se não houver endpoint de health, tenta uma requisição simples
			try {
				await api.get('/');
				result.serverReachable = true;
				result.responseTime = Date.now() - startTime;
			} catch (serverError) {
				result.serverReachable = false;
				result.error = 'Servidor não está acessível';
			}
		}

		return result;
	} catch (error) {
		result.error = 'Erro ao testar conectividade';
		return result;
	}
};

/**
 * Verifica se o dispositivo tem permissão para usar a internet
 */
export const checkInternetPermission = async (): Promise<boolean> => {
	try {
		const netInfo = await NetInfo.fetch();
		return netInfo.isConnected ?? false;
	} catch (error) {
		console.error('Erro ao verificar permissão de internet:', error);
		return false;
	}
};

/**
 * Obtém informações detalhadas sobre a conexão
 */
export const getConnectionInfo = async () => {
	try {
		const netInfo = await NetInfo.fetch();
		return {
			isConnected: netInfo.isConnected,
			isInternetReachable: netInfo.isInternetReachable,
			type: netInfo.type,
			isWifi: netInfo.type === 'wifi',
			isCellular: netInfo.type === 'cellular',
			details: netInfo.details,
		};
	} catch (error) {
		console.error('Erro ao obter informações de conexão:', error);
		return null;
	}
};