import { colors, makeTextStyle } from "@/styles/global/theme";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
		gap: 28,
		marginBottom: 42,
	},
	footer: {
		gap: 16,
		alignItems: 'center',
	},
	registerContainer: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		marginTop: 48,
		
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