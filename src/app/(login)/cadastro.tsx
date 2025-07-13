import { router } from 'expo-router';
import { useRef } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Button from '@/components/button/button';
import Input from '@/components/input/input';
import NavLink from '@/components/navLink/navLink';
import Progress from '@/components/progress/progress';

import { CadastroFormData } from '@/@types/formsData';
import { COLORS } from '@/styles/global/color';
import { stylesCadastro } from '@/styles/login/stylesCadastro';

const HandleNext = () => {
	router.push('/(login)/cadastroFinal');
};

const Cadastro: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useFormContext<CadastroFormData>();

	const sapRef = useRef<TextInput>(null);

	return (
		<View style={stylesCadastro.container}>
			<Progress progress={50} />
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
					onSubmitEditing: () => sapRef.current?.focus(),
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
					onSubmitEditing: handleSubmit(HandleNext),
					returnKeyType: 'next',
				}}
			/>
			<View style={stylesCadastro.buttonCadastro}>
				<Button
					title="Proximo"
					onPress={handleSubmit(HandleNext)}
					iconName="arrowright"
					size={22}
					fontSize={16}
					styles={{ height: 55, width: 130 }}
				/>
			</View>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'row',
				}}
			>
				<Text>Já possue uma conta, {''}</Text>
				<NavLink href="/(login)/login" style={{ color: COLORS.red[500] }}>
					retorne ao login
				</NavLink>
			</View>
		</View>
	);
};

export default Cadastro;
