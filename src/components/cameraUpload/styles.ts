// src/components/CameraUpload/CameraUpload.styles.ts
import { StyleSheet } from "react-native";
import { colors, spacing, statusBarHeight } from "../../styles/global/theme";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingTop: statusBarHeight,
	},

	camera: {
		flex: 1,
	},

	controls: {
		position: "absolute" as const,
		bottom: spacing.lg,
		left: spacing.lg,
		right: spacing.lg,
		alignItems: "center" as const,
		backgroundColor: "rgba(0,0,0,0.35)",
		paddingVertical: spacing.sm,
		borderRadius: 8,
	},

	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.lg,
	},

	text: {
		marginBottom: spacing.md,
		fontSize: 16,
		color: colors.textPrimary,
		textAlign: "center",
	},
});
