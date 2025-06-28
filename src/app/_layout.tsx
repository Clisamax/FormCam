import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
				<Slot />
			</FormProvider>
		</AuthProvider>
	);
}
