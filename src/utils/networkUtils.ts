import NetInfo from '@react-native-community/netinfo';
import { api } from '../services/api';

export interface NetworkTestResult {
	isConnected: boolean;
	isInternetReachable: boolean;
	serverReachable: boolean;
	responseTime?: number;
	error?: string;
	deviceIP?: string;
	serverURL?: string;
}

/**
 * Descobre o IP da máquina na rede local
 */
export const discoverLocalIP = async (): Promise<string[]> => {
	const ips: string[] = [];

	try {
		// Tentar obter IP via NetInfo
		const netInfo = await NetInfo.fetch();
		if (netInfo.details && typeof netInfo.details === 'object' && 'ipAddress' in netInfo.details) {
			const details = netInfo.details as { ipAddress?: string };
			if (details.ipAddress) {
				ips.push(details.ipAddress);
			}
		}

		// IPs comuns para testar
		const commonIPs = [
			'192.168.1.100',
			'192.168.1.101',
			'192.168.0.100',
			'192.168.0.101',
			'10.0.0.100',
			'10.0.0.101',
		];

		// Testar cada IP para ver qual responde
		for (const ip of commonIPs) {
			try {
				const testUrl = `http://${ip}:3338`;
				const response = await fetch(testUrl, {
					method: 'GET',
					timeout: 3000
				});
				if (response.ok) {
					ips.push(ip);
				}
			} catch (error) {
				// IP não responde, continuar para o próximo
			}
		}

	} catch (error) {
		console.error('Erro ao descobrir IP:', error);
	}

	return ips;
};

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

		// 2. Descobrir IPs disponíveis
		const availableIPs = await discoverLocalIP();
		result.deviceIP = availableIPs[0];

		// 3. Testar conectividade com o servidor
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