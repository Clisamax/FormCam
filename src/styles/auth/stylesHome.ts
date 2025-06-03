import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fontes";
import { StyleSheet } from "react-native";

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
		fontWeight: 'bold',
		fontSize: 18,
		flexDirection: 'row',
		fontFamily: FONTES.FONTS.defaultBold,
	},
	containerBotton: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 18,
		height: 100,
	},
	containerInput: {
		flex: 1,
		width: '100%',
		marginTop: 20,
	}
})