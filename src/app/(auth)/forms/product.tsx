import { produtosFormData } from '@/@types/types';
import Input from '@/components/input/input';
import { Control, useFormContext } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { DateInput } from '@/components/inputDatePicker';
import { styles } from '@/styles/auth/stylesProduct';
import { useRef } from 'react';
const Product: React.FC = () => {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useFormContext<produtosFormData>();
	const ndpRef = useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<DateInput
				control={control as unknown as Control}
				name="occurrenceDate"
				label="Occurrence Date"
				icon="calendar"
				oes
				s
			/>
			<Input
				icon={'user'}
				error={errors.name?.message || ''}
				formProps={{
					name: 'name',
					control: control as unknown as Control,
					rules: {
						required: 'nome é obrigatório',
						pattern: {
							value:
								/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,}(?: [A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,})+$/,
							message: 'Digite nome e sobrenome válidos (apenas letras)',
						},
						maxLength: {
							value: 50,
							message: 'Nome muito longo',
						},
						minLength: {
							value: 3,
							message: 'Nome muito curto',
						},
					},
				}}
				inputProps={{
					placeholder: 'Nome Completo',
					placeholderTextColor: 'white',
					onSubmitEditing: () => ndpRef.current?.focus(),
					returnKeyType: 'next',
				}}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Input
					style={{ width: '60%' }}
					icon={'box'}
					error={errors.produto?.message || ''}
					ref={ndpRef}
					formProps={{
						name: 'produto',
						control: control as unknown as Control,
						rules: {
							required: 'Produto é obrigatório',
							pattern: {
								value: /^[0-9]{8}$/,
								message: 'Produto inválido',
							},
						},
					}}
					inputProps={{
						placeholder: 'Produto',
						placeholderTextColor: 'white',
						onSubmitEditing: handleSubmit(() => {}),
						returnKeyType: 'next',
					}}
				/>
				<Input
					style={{ width: '35%' }}
					icon={'plus-circle'}
					error={errors.quantity?.message || ''}
					formProps={{
						name: 'quantity',
						control: control as unknown as Control,
						rules: {
							required: 'Quantity is required',
							pattern: {
								value: /^[0-9]+$/,
								message: 'Invalid Quantity',
							},
							min: {
								value: 1,
								message: 'Quantity must be greater than zero',
							},
						},
					}}
					inputProps={{
						placeholder: 'Quantity',
						placeholderTextColor: 'white',
						keyboardType: 'numeric',
						returnKeyType: 'done',
					}}
				/>
			</View>
		</View>
	);
};
export default Product;
