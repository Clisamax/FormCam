import { AuthContext } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
	const { signed, loading } = useContext(AuthContext);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return signed ? (
		<Redirect href="/(auth)/forms/home/home" />
	) : (
		<Redirect href="/(login)" />
	);
}
