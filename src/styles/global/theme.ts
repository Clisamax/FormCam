import { COLORS } from "@/styles/global/color";
import { Platform, StatusBar } from 'react-native';
import { lineHeight, rs } from './fontScale';

/* ────────────────────────────────────────────────────────────────
	 1️⃣  PALETTE DE CORES
	 ──────────────────────────────────────────────────────────────── */
export const colors = {
	white: COLORS.white,
	primary: COLORS.gray[400],
	secondary: COLORS.gray[700],
	background: COLORS.black,
	surface: COLORS.dark[900],
	textPrimary: COLORS.white,
	textSecondary: COLORS.text[500],
	error: COLORS.red[500],
	success: COLORS.success[500],
} as const;

export type ColorKey = keyof typeof colors;

/* ────────────────────────────────────────────────────────────────
	 2️⃣  SPACINGS (base 8dp)
	 ──────────────────────────────────────────────────────────────── */
export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
} as const;

export type SpacingKey = keyof typeof spacing;

/* ────────────────────────────────────────────────────────────────
	 3️⃣  FONTS – apenas a família
	 ──────────────────────────────────────────────────────────────── */
export const fonts = {
	default: 'Oswald',
	title: 'Lato',
	subtitle: 'Poppins',
	message: 'Poppins',
	code: 'FiraCode',
	button: 'Roboto',
	label: 'Lato',
	input: 'Montserrat',
} as const;

export type FontFamilyKey = keyof typeof fonts;

/* ────────────────────────────────────────────────────────────────
	 4️⃣  TIPOGRAFIA – tamanho responsivo + weight
	 ──────────────────────────────────────────────────────────────── */
export const typography = {
	caption: { fontSize: rs(12, 0), lineHeight: lineHeight(rs(12, 0)), fontWeight: 300 as const },
	body: { fontSize: rs(14, 0), lineHeight: lineHeight(rs(14, 0)), fontWeight: 500 as const },
	button: { fontSize: rs(16, 0), lineHeight: lineHeight(rs(16, 0)), fontWeight: 400 as const },
	default: { fontSize: rs(18, 0), lineHeight: lineHeight(rs(16, 0)), fontWeight: 400 as const },
	h3: { fontSize: rs(20, 0.05), lineHeight: lineHeight(rs(20, 0.05)), fontWeight: 500 as const },
	h2: { fontSize: rs(22, 0.05), lineHeight: lineHeight(rs(22, 0.05)), fontWeight: 600 as const },
	h1: { fontSize: rs(24, 0.05), lineHeight: lineHeight(rs(24, 0.05)), fontWeight: 700 as const },
	display: { fontSize: rs(28, 0.08), lineHeight: lineHeight(rs(28, 0.08)), fontWeight: 800 as const },
	giant: { fontSize: rs(34, 0.1), lineHeight: lineHeight(rs(34, 0.1)), fontWeight: 900 as const },
} as const;


export type TypographyKey = keyof typeof typography;
export type TypographyStyle = typeof typography[TypographyKey];

/* ────────────────────────────────────────────────────────────────
	 5️⃣  MAPA DE PESOS → SUFIXO DE FONTES (Expo Google Fonts)
	 ──────────────────────────────────────────────────────────────── */
export const weightSuffix = {
	100: 'Thin',
	200: 'ExtraLight',
	300: 'Light',
	400: 'Regular',
	500: 'Medium',
	600: 'SemiBold',
	700: 'Bold',
	800: 'ExtraBold',
	900: 'Black',
} as const;

export type FontWeightNumber = keyof typeof weightSuffix;

/* ────────────────────────────────────────────────────────────────
	 6️⃣  UTILITÁRIO – monta a string “Family_Weight”
	 ──────────────────────────────────────────────────────────────── */
export const getFontFamily = (
	familyKey: FontFamilyKey,
	weight: FontWeightNumber,
): string => {
	const family = fonts[familyKey];
	const suffix = weightSuffix[weight];
	return `${family}_${weight}${suffix}`;
};

/* ────────────────────────────────────────────────────────────────
	 7️⃣  UTILITÁRIOS DE PLATAFORMA
	 ──────────────────────────────────────────────────────────────── */
export const isIOS = Platform.OS === 'ios';
export const statusBarHeight = StatusBar.currentHeight ?? (isIOS ? 44 : 0);

/* ────────────────────────────────────────────────────────────────
	 8️⃣  OBJETO ÚNICO DE TEMA
	 ──────────────────────────────────────────────────────────────── */
export type Theme = {
	colors: typeof colors;
	spacing: typeof spacing;
	fonts: typeof fonts;
	typography: typeof typography;
	weightSuffix: typeof weightSuffix;
	getFontFamily: typeof getFontFamily;
	isIOS: typeof isIOS;
	statusBarHeight: typeof statusBarHeight;
};

export const theme = Object.freeze({
	colors,
	spacing,
	fonts,
	typography,
	weightSuffix,
	getFontFamily,
	isIOS,
	statusBarHeight,
}) satisfies Theme;

/* ────────────────────────────────────────────────────────────────
	 9️⃣  TIPOS EXPORTADOS
	 ──────────────────────────────────────────────────────────────── */
export type Colors = typeof colors;
export type Spacings = typeof spacing;
export type FontFamilies = typeof fonts;
export type Typography = typeof typography;

/* ────────────────────────────────────────────────────────────────
	 🔟  HELPER – estilo completo pronto para StyleSheet /
	 ────────  styled‑components
	 ──────────────────────────────────────────────────────────────── */
export const makeTextStyle = (
	familyKey: FontFamilyKey,
	typoKey: TypographyKey,
) => {
	const typo = typography[typoKey];
	return {
		fontFamily: getFontFamily(familyKey, typo.fontWeight as FontWeightNumber),
		fontSize: typo.fontSize,
		lineHeight: typo.lineHeight,
		// Se precisar, adicione aqui `letterSpacing`, `textTransform`, etc.
	};
};
