import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import styles from './styles';

export type ActionIconFamily = 'AntDesign' | 'FontAwesome' | 'MaterialIcons';

type IconName =
	| React.ComponentProps<typeof AntDesign>['name']
	| React.ComponentProps<typeof FontAwesome>['name']
	| React.ComponentProps<typeof MaterialIcons>['name'];

export interface OrbitAction {
	id: string;
	iconName: IconName;
	iconFamily: ActionIconFamily;
	onPress: () => void;
	color?: string;
}

interface FloatingOrbitButtonProps {
	/**
	 * @description Para modificar os ícones e as funções dos botões em órbita,
	 * altere os objetos dentro deste array 'actions'.
	 */
	actions: OrbitAction[];
	mainIconName?: IconName;
	mainIconFamily?: ActionIconFamily;
	containerStyle?: ViewStyle;
}

const FloatingOrbitButton = ({
	actions,
	mainIconName = 'plus',
	mainIconFamily = 'FontAwesome',
	containerStyle,
}: FloatingOrbitButtonProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const animation = useSharedValue(0);

	const toggleMenu = () => {
		const toValue = isOpen ? 0 : 1;
		animation.value = withSpring(toValue, { damping: 12, stiffness: 100 });
		setIsOpen(!isOpen);
	};

	const renderIcon = (
		name: IconName,
		family: ActionIconFamily,
		color = '#FFF',
		size = 24,
	) => {
		switch (family) {
			case 'AntDesign':
				return (
					<AntDesign
						name={name as React.ComponentProps<typeof AntDesign>['name']}
						size={size}
						color={color}
					/>
				);
			case 'FontAwesome':
				return (
					<FontAwesome
						name={name as React.ComponentProps<typeof FontAwesome>['name']}
						size={size}
						color={color}
					/>
				);
			case 'MaterialIcons':
				return (
					<MaterialIcons
						name={name as React.ComponentProps<typeof MaterialIcons>['name']}
						size={size}
						color={color}
					/>
				);
			default:
				return (
					<FontAwesome
						name={name as React.ComponentProps<typeof FontAwesome>['name']}
						size={size}
						color={color}
					/>
				);
		}
	};

	const createAnimatedStyle = (index: number) => {
		// Angles: 180 (Left), 225 (Up-Left), 270 (Up)
		const startAngle = 160;
		const endAngle = 280;
		const angleStep =
			actions.length > 1 ? (endAngle - startAngle) / (actions.length - 1) : 0;
		const angle = startAngle + index * angleStep;

		return useAnimatedStyle(() => {
			const radius = 80;
			const translateX =
				animation.value * radius * Math.cos(angle * (Math.PI / 180));
			const translateY =
				animation.value * radius * Math.sin(angle * (Math.PI / 180));

			return {
				transform: [{ translateX }, { translateY }],
				opacity: animation.value,
			};
		});
	};

	return (
		<View style={[styles.container, containerStyle]}>
			{actions.map((action, index) => (
				<Animated.View
					key={action.id}
					style={[
						styles.button,
						styles.submenu,
						createAnimatedStyle(index),
						action.color ? { backgroundColor: action.color } : {},
					]}
				>
					<TouchableOpacity
						onPress={() => {
							action.onPress();
							toggleMenu();
						}}
					>
						{renderIcon(action.iconName, action.iconFamily)}
					</TouchableOpacity>
				</Animated.View>
			))}

			<TouchableOpacity
				style={[styles.button, styles.menu]}
				onPress={toggleMenu}
				activeOpacity={0.8}
			>
				<Animated.View
					style={useAnimatedStyle(() => ({
						transform: [{ rotate: `${animation.value * 45}deg` }],
					}))}
				>
					{renderIcon(mainIconName, mainIconFamily)}
				</Animated.View>
			</TouchableOpacity>
		</View>
	);
};

export default FloatingOrbitButton;
