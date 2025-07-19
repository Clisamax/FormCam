
import { COLORS } from "@/styles/global/color";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		margin: 10,
		width: "55%",

	},
	label: {
		fontSize: 16,
		marginBottom: 5,
		color: COLORS.gray[500],
		fontFamily: "Poppins_400Regular",

	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		height: 40,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		backgroundColor: COLORS.gray[200],
		borderColor: COLORS.gray[400],
		gap: 10,

	},
	input: {
		flex: 1,
		color: COLORS.red[500],
		fontFamily: "Poppins_400Regular",
	},
	icon: {
		marginRight: 10,
	},
	error: {
		color: "red",
		fontSize: 12,
		marginTop: 5,
	},
});
