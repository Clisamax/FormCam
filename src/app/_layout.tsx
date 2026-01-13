// src/app/_layout.tsx   (ou qualquer caminho que você tenha)
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { AuthProvider } from '@/context/auth';
import { theme } from '@/styles/global/theme';
import { fontAssetMap, FontAssetMap } from '@/styles/global/fontAssets';
import { useFonts } from 'expo-font'; // expo-font já está instalado via expo-google-fonts

/* ------------------------------------------------------------------ */
/*  1️⃣  Forçar a splash screen até que todas as fontes estejam prontas */
/* ------------------------------------------------------------------ */
SplashScreen.preventAutoHideAsync();

/* ------------------------------------------------------------------ */
/*  2️⃣  Carregar dinamicamente as fontes usando o map que criamos   */
/* ------------------------------------------------------------------ */
export default function RootLayout() {
	/**
	 * `useFonts` aceita um objeto onde a chave = nome da fonte que será usado
	 * nos estilos (`fontFamily`) e o valor = o asset importado.
	 *
	 * Como `fontAssetMap` já tem o formato correto, basta espalhá‑lo.
	 */
	const [fontsLoaded, fontsError] = useFonts(fontAssetMap as FontAssetMap);

	/* -------------------------------------------------------------- */
	/* 3️⃣  Quando as fontes terminarem (ou houver erro) esconde a splash */
	/* -------------------------------------------------------------- */
	useEffect(() => {
		if (fontsLoaded || fontsError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontsError]);

	/* -------------------------------------------------------------- */
	/* 4️⃣  Caso falhe – nada será renderizado (você pode melhorar a UI) */
	/* -------------------------------------------------------------- */
	if (!fontsLoaded && fontsError) {
		return null;
	}

	/* -------------------------------------------------------------- */
	/* 5️⃣  React‑Hook‑Form context + Auth context (unchanged)           */
	/* -------------------------------------------------------------- */
	const methods = useForm();

	return (
		<AuthProvider>
			<FormProvider {...methods}>
				{/* 6️⃣  O Slot renderiza as rotas filhas (Home, SignIn, …) */}
				<Slot />
			</FormProvider>
		</AuthProvider>
	);
}
