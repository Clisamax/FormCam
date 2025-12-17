import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	containerTop: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		width: '100%',
	},
	container: {
		flex: 1,
		width: '95%',
	},
	containerProduto: {
		flexDirection: 'row', 
		justifyContent: 'space-between',
		marginTop: 10,
	},
	footer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,

	},
	button: {
		marginTop: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerRadio: {
		width: '100%',
		height: 120,
		alignItems: 'center',
		justifyContent: 'center',
	},
}
);