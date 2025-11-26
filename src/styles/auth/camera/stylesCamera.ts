import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fonts";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	fullScreenContainer: {
		flex: 1,
		backgroundColor: '#000',
		position: 'relative',
	},
	camera: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 40,
		alignSelf: 'flex-end',
		zIndex: 10,
		flexDirection: 'row',
		gap: 90,
	},
	button: {
		backgroundColor: COLORS.red[700],
		padding: 15,
		borderRadius: 25,
		width: 80,
		alignSelf: 'center',
		alignItems: 'center',

	},
	buttonDisabled: {
		backgroundColor: COLORS.gray[400],
		opacity: 0.6,
	},
	text: {
		fontFamily: FONTES.FONTS.button,
		color: COLORS.white,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.7)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 5,
	},
	overlayText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
	},
	loadingText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
		textAlign: 'center',
		marginTop: 50,
	},
	permissionText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
		textAlign: 'center',
		marginBottom: 20,
		paddingHorizontal: 20,
	},

});