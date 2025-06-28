import { Slot } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function CameraLayout() {
	return (
		<View style={styles.fullScreen}>
			<Slot />
		</View>
	);
}

const styles = StyleSheet.create({
	fullScreen: {
		flex: 1,
		backgroundColor: '#000',
	},
});
