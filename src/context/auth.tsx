import { IAuthProvider, IContext, IUser } from '@/@types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { api } from '../services/api';

// Verificar se a API foi importada corretamente
if (!api) {
	console.error('API não foi importada corretamente');
	throw new Error('API não está disponível');
}

if (typeof api.post !== 'function') {
	console.error('Método post não está disponível na API');
	throw new Error('API não tem método post');
}

console.log('API importada com sucesso no auth.tsx:', api.defaults.baseURL);

export const AuthContext = createContext<IContext>({} as IContext);

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora em milissegundos

export const AuthProvider = ({ children }: IAuthProvider) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [immichApiKey, setImmichApiKey] = useState<string | null>(
		process.env.EXPO_PUBLIC_IMMICH_API_KEY || null,
	);
	const [immichUrl, setImmichUrl] = useState<string | null>(
		process.env.EXPO_PUBLIC_IMMICH_URL || null,
	);
	const [loading, setLoading] = useState(true);
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const LoadStorageData = async () => {
			try {
				const storageToken = await AsyncStorage.getItem('@auth:token');
				const storageUser = await AsyncStorage.getItem('@auth:user');
				const storageTimestamp = await AsyncStorage.getItem('@auth:timestamp');
				const storageImmichKey = await AsyncStorage.getItem('@auth:immichApiKey');
				const storageImmichUrl = await AsyncStorage.getItem('@auth:immichUrl');

				if (storageToken && storageUser && storageTimestamp) {
					const now = Date.now();
					const lastActivity = Number(storageTimestamp);

					if (now - lastActivity < EXPIRATION_TIME) {
						// Restaura o token no header da API
						api.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
						setUser(JSON.parse(storageUser));

						if (storageImmichKey) setImmichApiKey(storageImmichKey);
						if (storageImmichUrl) setImmichUrl(storageImmichUrl);

						// Atualiza o timestamp a cada acesso
						await AsyncStorage.setItem('@auth:timestamp', now.toString());
					} else {
						// Expirou, remove tudo
						await AsyncStorage.multiRemove([
							'@auth:token',
							'@auth:user',
							'@auth:timestamp',
							'@auth:immichApiKey',
							'@auth:immichUrl',
						]);
						setUser(null);
						setImmichApiKey(process.env.EXPO_PUBLIC_IMMICH_API_KEY || null);
						setImmichUrl(process.env.EXPO_PUBLIC_IMMICH_URL || null);
					}
				}
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
			} finally {
				setLoading(false);
			}
		};
		LoadStorageData();
	}, []);

	// Monitorar estado da aplicação para timeout
	useEffect(() => {
		const checkValidity = async () => {
			const storageTimestamp = await AsyncStorage.getItem('@auth:timestamp');
			if (storageTimestamp) {
				const now = Date.now();
				const lastActivity = Number(storageTimestamp);
				if (now - lastActivity >= EXPIRATION_TIME) {
					console.log('Sessão expirada por inatividade');

					await clearAuthData();
					router.push('/(login)/login/login');
				} else {
					// Atualiza timestamp se ainda válido
					await AsyncStorage.setItem('@auth:timestamp', now.toString());
				}
			}
		};

		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				console.log('App voltou para active - verificando sessão');
				checkValidity();
			}
			appState.current = nextAppState;
		};

		const subscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			subscription.remove();
		};
	}, []);

	async function clearAuthData() {
		api.defaults.headers.common.Authorization = '';
		await AsyncStorage.multiRemove([
			'@auth:token',
			'@auth:user',
			'@auth:timestamp',
			'@auth:immichApiKey',
			'@auth:immichUrl',
		]);
		setUser(null);
		setImmichApiKey(process.env.EXPO_PUBLIC_IMMICH_API_KEY || null);
		setImmichUrl(process.env.EXPO_PUBLIC_IMMICH_URL || null);
	}

	async function Authenticate(sap: string, password: string) {
		try {
			console.log('Tentando fazer login com SAP:', sap);
			console.log('API disponível:', !!api);
			console.log('Método post disponível:', typeof api.post);

			const response = await api.post('/api/v1/login', {
				sap,
				password,
			});

			console.log('Login realizado com sucesso');

			api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

			const now = Date.now();
			await AsyncStorage.setItem('@auth:token', response.data.token);
			await AsyncStorage.setItem(
				'@auth:user',
				JSON.stringify(response.data.user),
			);
			await AsyncStorage.setItem('@auth:timestamp', now.toString());

			// Salvar credenciais do Immich se existirem na resposta
			const apiKey = response.data.immichApiKey || response.data.user?.immichApiKey;
			const url = response.data.immichUrl || response.data.user?.immichUrl;

			if (apiKey) {
				await AsyncStorage.setItem('@auth:immichApiKey', apiKey);
				setImmichApiKey(apiKey);
			}
			if (url) {
				await AsyncStorage.setItem('@auth:immichUrl', url);
				setImmichUrl(url);
			}

			setUser(response.data.user);
		} catch (error: unknown) {
			console.error('Erro no login:', error);

			// Tratamento específico de erros de rede
			const errorMessage =
				error instanceof Error ? error.message : String(error);

			if (errorMessage.includes('Sem conexão')) {
				throw new Error('Sem conexão com a internet. Verifique sua rede.');
			}

			if (errorMessage.includes('Tempo limite')) {
				throw new Error('Tempo limite excedido. Verifique sua conexão.');
			}

			if (errorMessage.includes('Erro de conexão')) {
				throw new Error('Erro de conexão. Verifique sua internet.');
			}

			// Outros erros
			throw error;
		}
	}

	async function Logout() {
		try {
			await clearAuthData();
			router.push('/(login)/login/login');
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				Logout,
				Authenticate: Authenticate,
				signed: !!user,
				immichApiKey,
				immichUrl,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
