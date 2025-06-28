import { AuthContext } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useContext } from 'react';

export default function App() {
	const { signed } = useContext(AuthContext);

	return signed ? (
		<Redirect href="/(auth)/forms" />
	) : (
		<Redirect href="/(login)" />
	);
}
