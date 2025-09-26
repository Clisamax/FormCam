import { produtosFormData } from '@/@types/types';
import Button from '@/components/button/button';
import Input from '@/components/input/input';
import { DateInput } from '@/components/inputDatePicker';
import InputProduct from '@/components/inputProduct/input';
import RadioField from '@/components/inputRadio/radioField';
import api from '@/services/api';
import { styles } from '@/styles/auth/stylesProduct';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Alert, TextInput, View } from 'react-native';

const Product: React.FC = () => {
	const {
		control,
		handleSubmit,
		register,
		setValue,
		watch,
		getValues,
		formState: { errors },
	} = useFormContext<produtosFormData>();
	const name = getValues('name');
	const produtoRef = useRef<TextInput>(null);
	const quantityRef = useRef<TextInput>(null);
	const nameOfResponsibleRef = useRef<TextInput>(null);
	const occurrenceDate = getValues('occurrenceDate');
	const product = getValues('product');
	const quantity = getValues('quantity');
	const nameOfResponsible = getValues('nameOfResponsible');
	const unit = getValues('unit');

	async function handleEnviar(data: produtosFormData) {
		try {
			const formData = {
				name: data.name.trim(),
				occurrenceDate: data.occurrenceDate,
				product: data.product.trim(),
				quantity: Number(data.quantity),
				nameOfResponsible: data.nameOfResponsible.trim(),
				unit: data.unit,
			};

			const response = await api.post('/api/v1/products', formData);

			if (response.status === 201) {
				Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
					{
						text: 'OK',
						onPress: () => router.push('/(auth)/camera/camera'),
					},
				]);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 409) {
					Alert.alert('Erro', 'Esse UUID já existe');
				} else if (error.response?.status === 400) {
					Alert.alert('Erro', 'Erro ao cadastrar, tente novamente');
				} else {
					Alert.alert('Erro', 'Erro inesperado, tente novamente');
				}
			} else {
				console.error('Erro inesperado:', error);
			}
		}
	}

	// Registrar o campo "quantity" para garantir que ele seja monitorado
	useEffect(() => {
		register('quantity', {
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
		});
	}, [register]);

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
			<View style={[styles.containerTop]}>
				<Button
					iconName="back"
					title="retornar"
					onPress={() => router.back()}
					variant="outline"
					styles={{ height: 50, width: 100 }}
					fontSize={12}
					size={14}
				/>
				<DateInput
					control={control as unknown as Control}
					name="occurrenceDate"
					label="Dia da ocorrencia"
					icon="calendar"
				/>
			</View>

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
			<View style={styles.containerProduto}>
				<Input
					style={{ width: '50%' }}
					icon={'box'}
					error={errors.product?.message || ''}
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
			<View style={styles.containerRadio}>
				<RadioField
					name="unit"
					control={control as unknown as Control}
					options={[
						{ label: 'display', value: 'display' },
						{ label: 'caixa', value: 'caixa' },
						{ label: 'palete', value: 'palete' },
					]}
					//label="Selecione a area de avaria"
					rules={{ required: 'Este campo é obrigatório' }}
				/>
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
			</View>
			<View style={styles.footer}>
				<Button
					styles={styles.button}
					title="confirmar"
					onPress={handleSubmit(handleEnviar)}
				/>
			</View>
		</View>
	);
};
export default Product;
