import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fonts";
import { StyleSheet } from "react-native";
import { makeTextStyle, colors } from "@/styles/global/theme";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		margin: 15,
		marginLeft: 35
	},
	containerTop: {
		flexDirection: 'row',
		gap: 24,
		flex: 0.2
	},
	containerTopText: {
		flexDirection: 'column'
	},
	text: {
		fontFamily: FONTES.FONTS.default,
		color: COLORS.gray[500],
	},
	topTextName: {
		color: COLORS.red[500],
		flexDirection: 'row',
		...makeTextStyle('default', 'default'),
	},
	containerBotton: {
		flexDirection: "row",
		gap: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 18,
		height: 80,
	},
	containerInput: {
		flex: 1,
		width: '100%',
		marginTop: 20,
	}
})