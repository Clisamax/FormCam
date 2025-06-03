import { Feather } from '@expo/vector-icons';
import { forwardRef } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { styles } from '@/components/input/styles';

type Props = {
	error: string;
	icon: keyof typeof Feather.glyphMap;
	formProps: UseControllerProps;
	inputProps: TextInputProps;
};

const Input = forwardRef<TextInput, Props>(
	({ icon, formProps, inputProps, error = '' }, ref) => {
		return (
			<Controller
				render={({ field }) => (
					<View>
						<View style={styles.group}>
							<View style={styles.icon}>
								<Feather name={icon} size={24} color="red" />
							</View>
							<TextInput
								ref={ref}
								value={field.value}
								onChangeText={field.onChange}
								style={styles.control}
								{...inputProps}
							/>
						</View>
						{error.length > 0 && <Text style={styles.error}>{error}</Text>}
					</View>
				)}
				{...formProps}
			/>
		);
	},
);
export default Input;
