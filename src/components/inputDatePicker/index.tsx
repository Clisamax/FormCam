import React from 'react';
import { View, Text, TouchableOpacity, TextInputProps } from 'react-native';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	RegisterOptions,
} from 'react-hook-form';
import DatePicker from 'react-native-datepicker';
import { styles } from './styles';
import { FontAwesome } from '@expo/vector-icons';

interface InputDatePickerProps<T extends FieldValues> {
	formProps: {
		name: Path<T>;
		control: Control<T>;
		rules?: Omit<
			RegisterOptions<T, Path<T>>,
			'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
		>;
	};
	inputProps?: TextInputProps;
	error?: string;
}

export function InputDatePicker<T extends FieldValues>({ formProps, inputProps, error }: InputDatePickerProps<T>) {
	return (
		<View style={styles.container}>
			<Controller
				control={formProps.control}
				name={formProps.name}
				rules={formProps.rules}
				render={({ field: { onChange, value } }) => (
					<DatePicker
						style={styles.inputContainer}
						date={value || ''}
						mode="date"
						placeholder={inputProps?.placeholder || "Selecione a data"}
						format="DD/MM/YYYY"
						minDate="01-01-2000"
						maxDate="01-01-2030"
						confirmBtnText="Confirmar"
						cancelBtnText="Cancelar"
						customStyles={{
							dateIcon: {
								position: 'absolute',
								left: 0,
								top: 4,
								marginLeft: 0,
							},
							dateInput: {
								marginLeft: 36,
								borderWidth: 0,
								alignItems: 'flex-start',
							},
							dateText: {
								color: 'black',
								fontSize: 14,
							},
							placeholderText: {
								color: '#ccc',
								fontSize: 14,
							},
						}}
					onDateChange={(date: string) => {
						onChange(date);
					}}
					iconComponent={
						<FontAwesome name="calendar" size={20} color="#ccc" style={styles.icon} />
					}
					{...inputProps}
					/>
				)}
			/>
			{error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}