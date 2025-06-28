import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';
import { Slot } from 'expo-router';
import { Image, Text, View } from 'react-native';

export default function FormsLayout() {
	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flex: 0.2,
					justifyContent: 'center',
					alignItems: 'center',
					paddingTop: '14%',
					paddingBottom: '2.5%',
					backgroundColor: COLORS.gray[200],
				}}
			>
				<Image
					style={{ width: '30%', height: '70%' }}
					alt="MaxCam Logo"
					resizeMode="contain"
					source={require('@/assets/MaxCam.png')}
				/>
				<View style={{ flexDirection: 'row', marginTop: -20 }}>
					<Text
						style={{
							fontSize: 42,
							fontFamily: FONTES.FONTS.defaultBold,
							color: COLORS.gray[500],
						}}
					>
						Form
					</Text>
					<Text
						style={{
							fontSize: 42,
							fontFamily: FONTES.FONTS.default,
							color: COLORS.red_04[400],
						}}
					>
						Cam
					</Text>
				</View>
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
