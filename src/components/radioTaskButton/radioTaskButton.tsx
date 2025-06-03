import { JSX } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { COLORS } from '@/styles/global/color';
import { styles } from './styles';

interface RadioOption {
	label: string;
	value: string;
}

interface FormData {
	[key: string]: string;
}

interface RadioTaskButtonProps {
	name: string;
	control: Control<FormData>;
	options: RadioOption[];
	label?: string;
	rules?: object;
	error?: string;
	onPress?: () => void;
}

const RadioTaskButton = ({
	name,
	control,
	options,
	label,
	rules,
	error,
	onPress,
}: RadioTaskButtonProps): JSX.Element => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { value, onChange } }) => {
				return (
					<View style={styles.container}>
						{options.map((options) => {
							return (
								<TouchableOpacity
									key={options.value}
									style={[styles.radio, { flexDirection: 'row' }]}
									onPress={() => {
										onChange(options.value);
										onPress?.();
									}}
								>
									<MaterialIcons
										name={
											value === options.value
												? 'radio-button-checked'
												: 'radio-button-unchecked'
										}
										size={24}
										style={
											value === options.value
												? { color: COLORS.red[500] }
												: { color: COLORS.gray[600] }
										}
									/>
									<Text
										style={
											value === options.value ? styles.textActive : styles.text
										}
									>
										{options.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				);
			}}
		/>
	);
};
export default RadioTaskButton;
