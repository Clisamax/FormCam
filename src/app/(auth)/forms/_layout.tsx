import { COLORS } from '@/styles/global/color';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Keyboard, Pressable, Text, View } from 'react-native';

export default function LoginLayout() {
	return (
		<Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<StatusBar
					style="auto"
					translucent={true}
					backgroundColor="transparent"
				/>
				<View
					style={{
						flex: 0.3,
						justifyContent: 'center',
						alignItems: 'center',

						backgroundColor: COLORS.gray[200],
					}}
				>
					<Image
						style={{ width: '100%', height: '100%', marginTop: '20%' }}
						alt="MaxCam Logo"
						resizeMode="cover"
						source={require('@/assets/formcam.png')}
					/>
				</View>
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						flex: 0.6,
						backgroundColor: COLORS.white,
						marginTop: '8%',
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
		</Pressable>
	);
}
