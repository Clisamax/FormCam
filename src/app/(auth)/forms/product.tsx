import { produtosFormData } from '@/@types/types';
import Button from '@/components/button/button';
import Input from '@/components/input/input';
import { DateInput } from '@/components/inputDatePicker';
import InputProduct from '@/components/inputProduct/input';
import { styles } from '@/styles/auth/stylesProduct';
import { useEffect, useRef } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { TextInput, View } from 'react-native';

const Product: React.FC = () => {
	const {
		control,
		handleSubmit,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<produtosFormData>();
	const produtoRef = useRef<TextInput>(null);
	const quantityRef = useRef<TextInput>(null);
	const nameOfResponsibleRef = useRef<TextInput>(null);

	// Use useEffect para lidar com a lógica de atualização do estado
	useEffect(() => {
		if (
			Number.isNaN(Number(watch('quantity'))) ||
			watch('quantity') === '' ||
			Number(watch('quantity')) < 1
		) {
			setValue('quantity', '1');
		}
	}, [watch, setValue]);

	const increment = () => {
		const currentQuantity = Number(watch('quantity')) || 0;
		if (currentQuantity < 9999) {
			setValue('quantity', String(currentQuantity + 1));
		}
	};

	const decrement = () => {
		const currentQuantity = Number(watch('quantity')) || 0;
		if (currentQuantity > 1) {
			setValue('quantity', String(currentQuantity - 1));
		}
	};	

	return (
		<View style={styles.container}>
			<DateInput
				control={control as unknown as Control}
				name="occurrenceDate"
				label="Dia da ocorrencia"
				icon="calendar"
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
					onSubmitEditing: () => produtoRef.current?.focus(),
					returnKeyType: 'next',
				}}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Input
					style={{ width: '50%' }}
					icon={'box'}
					error={errors.produto?.message || ''}
					ref={produtoRef}
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
						onSubmitEditing: () => quantityRef.current?.focus(),
						returnKeyType: 'next',
						keyboardType: 'numeric',
					}}
				/>
				<InputProduct
					style={{ width: '45%' }}
					icon={'minus-circle'}
					iconRight="plus-circle"
					increment={increment}
					decrement={decrement}
					error={errors.quantity?.message || ''}
					ref={quantityRef}
					formProps={{
						name: 'quantity',
						control: control as unknown as Control,
						rules: {
							required: 'Quantity is required',
							pattern: {
								value: /^[0-9]+$/,
								message: ' Quantidade invalida',
							},
							min: {
								value: 1,
								message: 'Quantidade deve ser maior que zero',
							},
							max: {
								value: 9999,
								message: 'Quantidade deve ser menor que 9999',
							},
						},
					}}
					inputProps={{
						keyboardType: 'numeric',
						returnKeyType: 'next',
						onSubmitEditing: () => nameOfResponsibleRef.current?.focus(),
					}}
				/>
			</View>
			<Input
				icon={'user'}
				error={errors.name?.message || ''}
				ref={nameOfResponsibleRef}
				formProps={{
					name: 'nameOfResponsible',
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
					placeholder: 'responsável pela avária',
					placeholderTextColor: 'white',
					onSubmitEditing: handleSubmit(() => {}),
					returnKeyType: 'next',
				}}
			/>
			<View style={styles.footer}>
				<Button styles={styles.button} title="confirmar" onPress={() => {}} />
			</View>
		</View>
	);
};
export default Product;
