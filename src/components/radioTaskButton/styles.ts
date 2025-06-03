import { COLORS } from "@/styles/global/color";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: { width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' },
	radio: {
		height: 50,
		width: '95%',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: COLORS.gray[300],
		gap: 6,
	},
	activeRadio: {
		backgroundColor: COLORS.red[500],
	},
	textActive: {
		color: COLORS.red[500],
		fontSize: 16,
		fontFamily: 'Poppins_700Bold',
		paddingRight: 20,
	},
	text: {
		color: COLORS.gray[600],
		fontSize: 16,
		fontFamily: 'Poppins_500Bold',
		paddingRight: 20,
	},
	containerConfirm: {
		width: 50,
		height: 50,
		backgroundColor: COLORS.gray[300],
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
});