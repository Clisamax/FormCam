import { forwardRef } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { styles } from '@/components/inputAnnotation/styles';

type Props = {
	error: string;
	formProps: UseControllerProps;
	inputProps: TextInputProps;
};

const Input = forwardRef<TextInput, Props>(
	({ formProps, inputProps, error = '' }, ref) => {
		return (
			<Controller
				render={({ field }) => (
					<View style={styles.container}>
						<View style={styles.group}>
							<TextInput
								multiline
								maxLength={50}
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
