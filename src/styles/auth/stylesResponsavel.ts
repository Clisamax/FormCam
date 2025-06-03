import { StyleSheet } from "react-native";

import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fontes";

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
		flexDirection: 'row',
		flex: 0.2,
		width: '100%',
	},
	containerMidLeft: {

		alignItems: 'flex-start',
		justifyContent: 'center',
		width: '40%',
		height: '100%',
		padding: 10,
	},
	containerMidRight: {
		width: '60%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingRight: 10,
	},
	containerFoot: {
		flex: 0.6,
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