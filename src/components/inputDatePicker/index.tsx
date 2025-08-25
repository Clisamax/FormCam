import { styles } from '@/components/inputDatePicker/styles';
import DateTimePicker, {
	DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
	Modal,
	Platform,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { DateInputProps } from "@/@types/types";
import Icon from 'react-native-vector-icons/Feather';
import { COLORS } from '@/styles/global/color';

const isSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};



export function DateInput({ control, name, label, icon }: DateInputProps) {
	const [show, setShow] = useState(false);

	return (
		<Controller
			control={control}
			name={name}
			defaultValue={new Date()}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<View style={styles.container}>
					{label && <Text style={styles.label}>{label}</Text>}
					<View style={styles.inputArea}>
						<View style={styles.iconContainer}>
							<Icon
								name={icon}
								size={20}
								color={error ? COLORS.gray[400] : COLORS.red[500]}
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
								{value === 'data de hoje'
									? 'Data de hoje'
									: value
										? new Date(value).toLocaleDateString()
										: 'Selecionar data'}
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
									value={value || new Date()}
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
												onChange(selectedDate); // Envia a data selecionada
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
