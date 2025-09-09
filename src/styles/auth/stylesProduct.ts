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
		flexDirection: 'row', justifyContent: 'space-between',
	},
	footer: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		marginTop: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerRadio: {
		width: '100%',
		height: 120,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
}
);