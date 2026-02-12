import { StyleSheet } from "react-native";

import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fonts";

export const styles = StyleSheet.create({

	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',

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
		flex: 0.6,
		width: '100%',
		height: '100%',
		padding: 10,
		gap: 5,
		marginTop: '4%',
	},
	containerFoot: {
		flex: 0.2,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontFamily: FONTES.FONTS.default,
		color: COLORS.gray[600],
		letterSpacing: 1

	},
	textBold: {
		fontFamily: FONTES.FONTS.defaultBold,
		color: COLORS.gray[600],
		letterSpacing: 1,
		fontSize: 18,
	},
	textRed: {
		fontFamily: FONTES.FONTS.code,
		fontSize: 14,
		fontWeight: 'bold',
		color: COLORS.red[500],
		letterSpacing: 0.5
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


})