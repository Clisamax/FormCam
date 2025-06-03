import { COLORS } from "@/styles/global/color";
import { FONTES } from "@/styles/global/fontes";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		padding: 4,
		gap: 12,
		flexDirection: 'row',
	},
	labelContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 14
	},
	label: {
		fontSize: 18,
		color: COLORS.gray[700],
		marginBottom: 2,
		fontFamily: FONTES.FONTS.defaultBold,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
	},
	radio: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: COLORS.red[500],
		alignItems: 'center',
		justifyContent: 'center',
	},
	selected: {
		height: 10,
		width: 10,
		borderRadius: 5,
		backgroundColor: COLORS.red[500],
	},
	optionLabel: {
		marginLeft: 10,
		fontSize: 16,
		color: COLORS.gray[700],
	},
	error: {
		color: COLORS.red[500],
		fontSize: 12,
		marginTop: 4,
	},
});