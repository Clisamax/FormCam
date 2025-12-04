import { DateInputProps } from "@/@types/types";
import { styles } from '@/components/inputDatePicker/styles';
import { COLORS } from '@/styles/global/color';
import DateTimePicker, {
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
	Modal,
	Platform,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const isSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

const formatDateToDDMMYYYY = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};



export function DateInput({ control, name, label, icon }: DateInputProps) {
	const [show, setShow] = useState(false);

	// Helper to convert value to Date object for the picker
	const getDateValue = (value: any): Date => {
		if (!value) return new Date();
		if (value === 'data de hoje') return new Date();
		if (value instanceof Date) return value;
		// If it's a dd-mm-yyyy string, parse it
		if (typeof value === 'string' && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
			const [day, month, year] = value.split('-');
			return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		}
		return new Date(value);
	};

	// Helper to display the value
	const getDisplayValue = (value: any): string => {
		if (value === 'data de hoje') return 'Data de hoje';
		if (!value) return 'Selecionar data';
		// If it's already a dd-mm-yyyy string, return it
		if (typeof value === 'string' && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
			return value;
		}
		// Otherwise convert to dd-mm-yyyy
		return formatDateToDDMMYYYY(getDateValue(value));
	};

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={formatDateToDDMMYYYY(new Date())}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<View style={styles.container}>
					{label && <Text style={styles.label}>{label}</Text>}
					<View style={styles.inputArea}>
						<View style={styles.iconContainer}>
							<Icon
								name={icon}
								size={20}
								color={error ? COLORS.red[500] : COLORS.gray[400]}
							/>
						</View>
						<TouchableOpacity
							style={[
								styles.inputContainer,
								error && { borderColor: COLORS.red[500] },
							]}
							onPress={() => setShow(true)}
						>
							<Text
								style={[
									styles.inputText,
									!value && { color: COLORS.gray[400] },
								]}
							>
								{getDisplayValue(value)}
							</Text>
						</TouchableOpacity>
					</View>

					{error && <Text style={styles.errorText}>{error.message}</Text>}

					<Modal
						transparent={true}
						animationType="fade"
						visible={show}
						onRequestClose={() => setShow(false)}
					>
						<Pressable
							style={styles.centeredView}
							onPress={() => setShow(false)} // Fecha o modal ao clicar fora
						>
							<Pressable
								style={styles.datePickerModalView}
								onPress={(e) => e.stopPropagation()}
							>
								<DateTimePicker
									value={getDateValue(value)}
									mode="date"
									display={Platform.OS === 'ios' ? 'spinner' : 'default'}
									onChange={(
										event: DateTimePickerEvent,
										selectedDate?: Date,
									) => {
										setShow(Platform.OS === 'ios'); // Mantém o modal aberto no iOS, fecha no Android
										if (event.type === 'set' && selectedDate) {
											const today = new Date();
											if (isSameDay(selectedDate, today)) {
												onChange('data de hoje'); // Envia a string "data de hoje"
											} else {
												onChange(formatDateToDDMMYYYY(selectedDate)); // Envia a data formatada como dd-mm-yyyy
											}
										}
										if (Platform.OS === 'android') {
											setShow(false); // Fecha o picker no Android após seleção
										}
									}}
								/>
								{Platform.OS === 'ios' && (
									<Pressable
										style={styles.closeButton}
										onPress={() => setShow(false)}
									>
										<Text style={styles.closeButtonText}>Confirmar</Text>
									</Pressable>
								)}
							</Pressable>
						</Pressable>
					</Modal>
				</View>
			)}
		/>
	);
}
