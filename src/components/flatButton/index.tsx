import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import styles from './styles';
import { router } from 'expo-router';

const FlatButtonAnimated = () => {
	const [isOpen, setIsOpen] = useState(false);
	const animation = useSharedValue(0);

	const toggleMenu = () => {
		const toValue = isOpen ? 0 : 1;
		animation.value = withSpring(toValue, { damping: 8, stiffness: 100 });
		setIsOpen(!isOpen);
	};

	const createAnimatedStyle = (angle: number) => {
		return useAnimatedStyle(() => {
			const radius = 80;
			const translateX =
				animation.value * radius * Math.cos(angle * (Math.PI / 180));
			const translateY =
				animation.value * radius * Math.sin(angle * (Math.PI / 180));

			return {
				transform: [{ translateX }, { translateY }],
			};
		});
	};

	const animatedStyle1 = createAnimatedStyle(160);
	const animatedStyle2 = createAnimatedStyle(210);
	const animatedStyle3 = createAnimatedStyle(260);

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.button, styles.submenu, animatedStyle1]}>
				<TouchableOpacity>
					<FontAwesome name="image" size={24} color="#FFF" />
				</TouchableOpacity>
			</Animated.View>
			<Animated.View style={[styles.button, styles.submenu, animatedStyle2]}>
				<TouchableOpacity>
					<AntDesign name="form" size={24} color="#FFF" />
				</TouchableOpacity>
			</Animated.View>

			<Animated.View style={[styles.button, styles.submenu, animatedStyle3]}>
				<TouchableOpacity onPress={() => router.navigate('/(auth)/forms/home/home')}>
					<FontAwesome name="home" size={24} color="#FFF" />
				</TouchableOpacity>
			</Animated.View>
			<TouchableOpacity
				style={[styles.button, styles.menu]}
				onPress={toggleMenu}
			>
				<FontAwesome name="plus" size={24} color="#FFF" />
			</TouchableOpacity>
		</View>
	);
};

export default FlatButtonAnimated;
