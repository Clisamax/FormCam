
import { COLORS } from "@/styles/global/color";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	label: {
		fontSize: 14,
		color: COLORS.dark[500],
		marginBottom: 6,
		marginLeft: '20%',
		fontWeight: '500',
	},
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.gray[400],
		borderRadius: 8,
		paddingHorizontal: 12,
		height: 48,
		justifyContent: 'space-between',
		backgroundColor: COLORS.gray[200]
	},
	inputText: {
		fontSize: 16,
		color: '#333',
	},
	errorText: {
		color: COLORS.red[500],
		fontSize: 12,
		marginTop: 4,
	},
	container: {
		width: '100%',
		marginBottom: 10,
	},
	inputArea: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
	iconContainer: {
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: COLORS.gray[400],
		borderRadius: 8,
		marginRight: 8,
		backgroundColor: COLORS.gray[200]
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	datePickerModalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		width: '90%',
		padding: 15,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButton: {
		backgroundColor: COLORS.blue[500],
		borderRadius: 10,
		padding: 10,
		elevation: 2,
		marginTop: 10,
	},
	closeButtonText: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
