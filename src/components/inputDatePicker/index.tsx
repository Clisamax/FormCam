import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInputProps, Platform } from 'react-native';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	RegisterOptions,
} from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
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

const parseDateTimeString = (dateTimeString: string): Date => {
	// Assuming dateTimeString is in a format like "DD/MM/YYYY, HH:MM:SS"
	// This parsing is basic and might need to be more robust depending on exact locale output
	const [datePart, timePart] = dateTimeString.split(', ');
	const [day, month, year] = datePart.split('/').map(Number);
	const [hours, minutes, seconds] = timePart.split(':').map(Number);
	return new Date(year, month - 1, day, hours, minutes, seconds || 0);
};

export function InputDatePicker<T extends FieldValues>({ formProps, inputProps, error }: InputDatePickerProps<T>) {
	const [open, setOpen] = useState(false);

	return (
		<View style={styles.container}>
			<Controller
				control={formProps.control}
				name={formProps.name}
				rules={formProps.rules}
				render={({ field: { onChange, value } }) => (
					<>
						<TouchableOpacity onPress={() => setOpen(true)}>
							<View style={styles.inputContainer}>
								<FontAwesome name="calendar" size={20} color="#ccc" style={styles.icon} />
								<Text style={styles.input}>{value || inputProps?.placeholder}</Text>
							</View>
						</TouchableOpacity>
						<DatePicker
							modal
							open={open}
							date={value ? parseDateTimeString(value) : new Date()}
							onConfirm={(date) => {
								setOpen(false);
								onChange(date.toLocaleString('pt-BR')); // Format as datetime string
							}}
							onCancel={() => {
								setOpen(false);
							}}
							mode="datetime" // Changed to datetime
							minimumDate={new Date(2000, 0, 1)}
							maximumDate={new Date(2030, 0, 1)}
						/>
					</>
				)}
			/>
			{error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}