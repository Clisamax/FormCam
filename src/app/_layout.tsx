import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';

import { FiraCode_400Regular } from '@expo-google-fonts/fira-code';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	useFonts,
} from '@expo-google-fonts/poppins';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';

import { AuthProvider } from '@/context/auth';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';

SplashScreen.preventAutoHideAsync();

export default function loginLayout() {
	const [loaded, error] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		FiraCode_400Regular,
		Lato_700Bold,
		Lato_400Regular,
		Oswald_400Regular,
		Oswald_700Bold,
		Roboto_500Medium,
		Montserrat_400Regular,
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && error) {
		return null;
	}
	const methods = useForm();
	return (
		<AuthProvider>
			<FormProvider {...methods}>
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
			</FormProvider>
		</AuthProvider>
	);
}
