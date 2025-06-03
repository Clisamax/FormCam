import { forwardRef, useState } from 'react';
import {
	Text,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	View,
} from 'react-native';
import { Controller, UseControllerProps } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';

import { styles } from '@/components/inputSenha/styles';

type Props = {
	error?: string;
	icon: keyof typeof Feather.glyphMap;
	formProps: UseControllerProps;
	inputProps: TextInputProps;
	secureTextEntry: boolean;
};

const InputSenha = forwardRef<TextInput, Props>(
	({ icon, formProps, inputProps, error = '', secureTextEntry }, ref) => {
		const [secury, setSecury] = useState(secureTextEntry);
		return (
			<Controller
				render={({ field }) => (
					<View>
						<View style={styles.group}>
							<TouchableOpacity
								style={styles.icon}
								onPress={() => {
									setSecury(!secury);
								}}
							>
								<Feather
									name={secury ? 'eye' : 'eye-off'}
									size={24}
									color="red"
								/>
							</TouchableOpacity>
							<TextInput
								secureTextEntry={secury}
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
export default InputSenha;
