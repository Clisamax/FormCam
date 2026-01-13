import {
	FiraCode_400Regular,
	// (outros pesos de FiraCode que você eventualmente usar)
} from '@expo-google-fonts/fira-code';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import {
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';

import { theme } from '@/styles/global/theme';

/**
 * Mapeia o nome que o tema gera (ex: "Oswald_400Regular")
 * para a fonte carregada por expo‑google‑fonts.
 *
 * Se precisar de outro peso, basta acrescentar a importação
 * acima e inseri‑lo neste objeto.
 */
export const fontAssetMap = {
	// ----- Oswald ----------------------------------------------------
	[theme.getFontFamily('default', 400)]: Oswald_400Regular,
	[theme.getFontFamily('default', 700)]: Oswald_700Bold,

	// ----- Lato -------------------------------------------------------
	[theme.getFontFamily('title', 400)]: Lato_400Regular,
	[theme.getFontFamily('title', 700)]: Lato_700Bold,

	// ----- Poppins ----------------------------------------------------
	[theme.getFontFamily('subtitle', 400)]: Poppins_400Regular,
	[theme.getFontFamily('subtitle', 500)]: Poppins_500Medium,
	[theme.getFontFamily('subtitle', 600)]: Poppins_600SemiBold,
	[theme.getFontFamily('subtitle', 700)]: Poppins_700Bold,

	// ----- Montserrat -------------------------------------------------
	[theme.getFontFamily('input', 400)]: Montserrat_400Regular,

	// ----- Roboto -----------------------------------------------------
	[theme.getFontFamily('button', 500)]: Roboto_500Medium,

	// ----- Fira Code --------------------------------------------------
	[theme.getFontFamily('code', 400)]: FiraCode_400Regular,
} as const;

/*  Exporta o tipo “record” para que o useFonts receba a forma correta */
export type FontAssetMap = typeof fontAssetMap;
