import { Control, Controller } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '@/components/inputRadio/styles';

interface RadioOption {
	label: string;
	value: string;
}

interface FormData {
	[key: string]: string;
}

interface RadioFieldProps {
	name: string;
	control: Control<FormData>;
	options: RadioOption[];
	label?: string;
	rules?: object;
	error?: string;
}

const RadioField = ({
	name,
	control,
	options,
	label,
	rules,
	error,
}: RadioFieldProps) => {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { value, onChange } }) => (
				<View style={styles.labelContainer}>
					<View>{label && <Text style={styles.label}>{label}</Text>}</View>
					<View style={styles.container}>
						{options.map((option) => (
							<TouchableOpacity
								key={option.value}
								style={styles.option}
								onPress={() => onChange(option.value)}
							>
								<View style={styles.radio}>
									{value === option.value && <View style={styles.selected} />}
								</View>
								<Text style={styles.optionLabel}>{option.label}</Text>
							</TouchableOpacity>
						))}
						{error && <Text style={styles.error}>{error}</Text>}
					</View>
				</View>
			)}
		/>
	);
};

export default RadioField;
