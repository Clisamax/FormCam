import {produtosFormData} from '@/@types/formsData';
import Input from '@/components/input/input';
import { Control, useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { styles } from '@/styles/auth/stylesProduto';
import { useRef } from 'react';

const Produto: React.FC<produtosFormData> = (data: produtosFormData) => {
	const {
		control,
		formState: { errors },
	} = useForm();
	const ndpRef = useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<Input
				icon={'user'}
				error={(errors.name?.message || '')}
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
					onSubmitEditing: () => {},
					returnKeyType: 'next',
				}}
			/>
			<Input
				icon={'users'}
				error={errors.sap?.message || ''}
				ref={sapRef}
				formProps={{
					name: 'sap',
					control: control as unknown as Control,
					rules: {
						required: 'SAP é obrigatório',
						pattern: {
							value: /^[0-9]{8}$/,
							message: 'SAP inválido',
						},
					},
				}}
				inputProps={{
					placeholder: 'SAP',
					placeholderTextColor: 'white',
					onSubmitEditing: handleSubmit(()=> {}),
					returnKeyType: 'next',
				}}
			/>
		</View>
	);
};
export default Produto;
