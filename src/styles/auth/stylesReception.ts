import { StyleSheet } from "react-native";

import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fonts";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	containerTop: {
		flex: 0.2,
		width: '100%',
		flexDirection: 'row',

	},
	containerTopLefth: {
		width: '30%',
		height: '100%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',

	},
	containerTopRight: {
		flexDirection: 'column',
		width: '70%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerMid: {
		flex: 0.1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
		marginTop: 20,
		gap: 10,
	},
	containerFoot: {
		flex: 0.7,
		width: '100%',
	},
	text: {
		fontFamily: FONTES.FONTS.default,
		color: COLORS.gray[600],
		letterSpacing: 0.4

	},
	textSpace: {
		fontFamily: FONTES.FONTS.default,
		color: COLORS.gray[500],
		letterSpacing: 2,
	},
	topTextName: {
		color: COLORS.red[500],
		fontWeight: 'bold',
		fontSize: 18,
		flexDirection: 'row',
		fontFamily: FONTES.FONTS.defaultBold,
	},
	containerFootButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginTop: 20,
	}
})