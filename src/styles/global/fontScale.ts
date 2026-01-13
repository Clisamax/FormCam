// src/theme/fontScale.ts
import { Dimensions, PixelRatio, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

/**
 * Converte um tamanho base (dp) em tamanho responsivo.
 *
 * - baseSize: tamanho definido nas guidelines (ex.: 16)
 * - factor   : quanto o tamanho deve mudar em telas maiores.
 *   0   → nenhuma alteração (tamanho fixo)
 *   0.1 → aumenta ~10 % em dispositivos maiores
 */
export const rs = (baseSize: number, factor = 0.1): number => {
	// 1.  Ajuste para a densidade (PixelRatio)
	const densityAdjusted = moderateScale(baseSize, factor);

	// 2.  Respeita a preferência de tamanho do usuário:
	//     `fontScale` = 1 (padrão) → 1.2 (texto 20 % maior) …
	const fontScale = PixelRatio.getFontScale?.() ?? 1;

	return Math.round(densityAdjusted * fontScale);
};

/**
 * Uma versão “hard‑code” para line‑height,
 * mantendo a proporção 1.35 × font‑size (valor típico).
 */
export const lineHeight = (fontSize: number) => Math.round(fontSize * 1.35);
