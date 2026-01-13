import { StyleSheet } from "react-native";
import { colors, makeTextStyle } from "@/styles/global/theme";

export const stylesCadastro = StyleSheet.create({
	pressable: {
		flex: 1,
		width: '100%',
	},
	container: {
		width: '100%',
		gap: 22,
	},
	buttonCadastro: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const stylesCadastroFinal = StyleSheet.create({
	pressable: {
		flex: 1,
		width: '100%',
	},
	container: {
		flex: 1,
		width: '100%',
		padding: 20,
	},
	form: {
		width: '100%',
		gap: 24,
		marginTop: 32,
		marginBottom: 32,
	},
	buttonContainer: {
		alignItems: 'center',
	},
	registerText: {
			...makeTextStyle('default', 'h3'),
			textAlign: 'center',
			color: colors.textSecondary,
		},
		link: {
			color: colors.error,
			...makeTextStyle('title', 'h3'),
		},
});

