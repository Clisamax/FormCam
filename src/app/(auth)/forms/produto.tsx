import { produtosFormData } from '@/@types/types';
import Input from '@/components/input/input';
import { Control, useFormContext } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { styles } from '@/styles/auth/stylesProduto';
import { useRef } from 'react';

const Produto: React.FC = () => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useFormContext<produtosFormData>();
	const ndpRef = useRef<TextInput>(null);

	return (
		<View style={styles.container}>
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
			<Input
				style={{width: '60%'}}
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
		</View>
	);
};
export default Produto;
