import { COLORS } from '@/styles/global/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		width: '100%',

	},
	group: {
		flexDirection: 'row',
		height: 46,
		backgroundColor: COLORS.gray[200],
		alignItems: 'center',
		overflow: 'hidden',
		marginTop: 10,
		borderRadius: 8
	},
	icon: {
		width: 46,
		height: 46,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		borderRightWidth: 5,
		borderRightColor: COLORS.white
	},
	iconRight: {
		width: 46,
		height: 46,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		borderLeftWidth: 5,
		borderLeftColor: COLORS.white
	},
	control: {
		flex: 1,
		padding: 16,
		letterSpacing: 1
	},
	error: {
		fontSize: 12,
		paddingLeft: 22,
		marginTop: 4,
		color: COLORS.red[500]

	}
})


