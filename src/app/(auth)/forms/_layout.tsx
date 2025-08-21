import { COLORS } from '@/styles/global/color';
import { Slot } from 'expo-router';
import { Image, Text, View } from 'react-native';

export default function FormsLayout() {
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 0.3,
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: '8%',
					backgroundColor: COLORS.gray[200],
				}}
			>
				<Image
					style={{ width: '100%', height: '100%' }}
					alt="MaxCam Logo"
					resizeMode="cover"
					source={require('@/assets/ChatGPT Image 5 de jun. de 2025, 18_08_20.png')}
				/>
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flex: 0.6,
					backgroundColor: COLORS.white,
				}}
			>
				<Slot />
			</View>
			<View
				style={{
					flex: 0.05,
					justifyContent: 'center',
					alignItems: 'center',
					height: 50,
					backgroundColor: COLORS.gray[400],
				}}
			>
				{''}
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flex: 0.15,
					backgroundColor: COLORS.red[700],
					flexDirection: 'row',
				}}
			>
				<Text style={{ color: COLORS.white }}>BY </Text>
				<Text style={{ color: COLORS.gray[400] }}>Clisamax Gomes</Text>
			</View>
		</View>
	);
}
