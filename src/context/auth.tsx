import { IAuthProvider, IContext, Iuser } from '@/@types/authContextTypes';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext<IContext>({} as IContext);

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hora em milissegundos

export const AuthProvider = ({ children }: IAuthProvider) => {
	const [user, setUser] = useState<Iuser | null>(null);

	useEffect(() => {
		const LoadStorageData = async () => {
			try {
				const storageToken = await AsyncStorage.getItem('@auth:token');
				const storageUser = await AsyncStorage.getItem('@auth:user');
				const storageTimestamp = await AsyncStorage.getItem('@auth:timestamp');

				if (storageToken && storageUser && storageTimestamp) {
					const now = Date.now();
					const lastActivity = Number(storageTimestamp);

					if (now - lastActivity < EXPIRATION_TIME) {
						setUser(JSON.parse(storageUser));
						// Atualiza o timestamp a cada acesso
						await AsyncStorage.setItem('@auth:timestamp', now.toString());
					} else {
						// Expirou, remove tudo
						await AsyncStorage.multiRemove([
							'@auth:token',
							'@auth:user',
							'@auth:timestamp',
						]);
						setUser(null);
					}
				}
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
			}
		};
		LoadStorageData();
	}, []);

	async function Authenticate(sap: string, password: string) {
		try {
			const response = await api.post('/login', {
				sap,
				password,
			});

			api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

			const now = Date.now();
			await AsyncStorage.setItem('@auth:token', response.data.token);
			await AsyncStorage.setItem(
				'@auth:user',
				JSON.stringify(response.data.user),
			);
			await AsyncStorage.setItem('@auth:timestamp', now.toString());

			setUser(response.data.user);
		} catch (error) {
			console.error('Erro no login:', error);
			throw error; // Propaga o erro para ser tratado no componente Login
		}
	}

	async function Logout() {
		try {
			api.defaults.headers.common.Authorization = '';
			await AsyncStorage.multiRemove([
				'@auth:token',
				'@auth:user',
				'@auth:timestamp',
			]);
			setUser(null);
		} catch (error) {
			console.error('Erro ao fazer logout:', error);
		}
	}

	return (
		<AuthContext.Provider
			value={{ user, Logout, Authenticate: Authenticate, signed: !!user }}
		>
			{children}
		</AuthContext.Provider>
	);
};
