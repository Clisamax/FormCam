import { COLORS } from '@/styles/global/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		padding: 20,
	},
	form: {
		width: '100%',
		gap: 24,
		marginBottom: 32,
	},
	footer: {
		gap: 16,
		alignItems: 'center',
	},
	registerContainer: {
		alignItems: 'center',
		marginTop: 8,
	},
	registerText: {
		textAlign: 'center',
	},
	link: {
		color: COLORS.red[500],
		fontWeight: 'bold',
	},
});