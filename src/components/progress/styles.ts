import { COLORS } from "@/styles/global/color";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		width: '93%',
		height: 4,
		backgroundColor: COLORS.gray[300],
		margin: 12,

	},
	progress: {
		height: 4,
		backgroundColor: COLORS.red[500],
	},
});
