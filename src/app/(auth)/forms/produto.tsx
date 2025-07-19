import { produtosFormData } from '@/@types/types';
import Input from '@/components/input/input';
import { Control, useFormContext } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { InputDatePicker } from '@/components/inputDatePicker';
import { styles } from '@/styles/auth/stylesProduto';
import { useRef } from 'react';
const Produto: React.FC = () => {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useFormContext<produtosFormData>();
	const ndpRef = useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<InputDatePicker<produtosFormData>
				error={errors.dataOcorrencia?.message || ''}
				formProps={{
					name: 'dataOcorrencia',
					control: control,
					rules: {
						required: 'Data de ocorrência é obrigatória',
					},
				}}
				inputProps={{
					placeholder: 'Data de Ocorrência',
					placeholderTextColor: 'white',
					returnKeyType: 'next',
				}}

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
					error={errors.quantidade?.message || ''}
					formProps={{
						name: 'quantidade',
						control: control as unknown as Control,
						rules: {
							required: 'Quantidade é obrigatório',
							pattern: {
								value: /^[0-9]+$/,
								message: 'Quantidade inválida',
							},
							min: {
								value: 1,
								message: 'Quantidade deve ser maior que zero',
							},
						},
					}}
					inputProps={{
						placeholder: 'Quantidade',
						placeholderTextColor: 'white',
						keyboardType: 'numeric',
						returnKeyType: 'done',
					}}
				/>
			</View>
		</View>
	);
};
export default Produto;
