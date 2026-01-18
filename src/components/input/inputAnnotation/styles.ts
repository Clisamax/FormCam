import { COLORS } from '@/styles/global/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	group: {
		width: '90%',
		height: 180,
		backgroundColor: COLORS.gray[200],
		alignItems: 'center',
		overflow: 'hidden',
		margin: 10,
		justifyContent: 'center',
		marginLeft: 20,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.gray[800],
	},
	control: {
		flex: 1,
		padding: 16,
		letterSpacing: 3,
		width: 300,
	},
	error: {
		fontSize: 12,
		paddingLeft: 22,
		marginTop: 4,
		color: COLORS.red[500]
	}
})


