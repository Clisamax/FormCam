import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Button from '@/components/button/button';
import InputSenha from '@/components/inputPassword/inputPassword';
import Progress from '@/components/progress/progress';
import { api } from '../../services/api';

import { CadastroFormData } from '@/@types/types';
import { stylesCadastroFinal } from '@/styles/login/stylesRegistration';

const CadastroFinal = () => {
	const [loading, setLoading] = useState(false);
	const confirmRef = useRef<TextInput>(null);

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useFormContext<CadastroFormData>();

	const validatePasswordConfirm = (confirm: string) => {
		const { password } = getValues();
		if (password !== confirm) {
			return 'As senhas não coincidem';
		}
		return true;
	};

	async function handleCadastrar(data: CadastroFormData) {
		try {
			setLoading(true);
			const formData = {
				name: data.name.trim(),
				sap: data.sap.trim(),
				password: data.password,
			};

			const response = await api.post('/create_user', formData);

			if (response.status === 201) {
				Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
					{
						text: 'OK',
						onPress: () => router.push('/(login)/login'),
					},
				]);
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				if (error.response?.status === 409) {
					Alert.alert('Erro', 'Este SAP já está cadastrado');
				} else {
					Alert.alert(
						'Erro',
						error.response?.data?.message || 'Erro ao realizar cadastro',
					);
				}
			} else {
				Alert.alert('Erro', 'Erro ao realizar cadastro');
			}
			console.error('Erro no cadastro:', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={stylesCadastroFinal.container}>
			<Progress progress={100} />
			<View style={stylesCadastroFinal.form}>
				<InputSenha
					icon="eye"
					error={errors.password?.message || ''}
					formProps={{
						name: 'password',
						control: control as unknown as Control,
						rules: {
							required: 'Senha é obrigatória',
							pattern: {
								value:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
								message:
									'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
							},
						},
					}}
					inputProps={{
						placeholder: 'Digite sua senha',
						onSubmitEditing: () => confirmRef.current?.focus(),
						returnKeyType: 'next',
						editable: !loading,
					}}
					secureTextEntry={true}
				/>

				<InputSenha
					icon="eye"
					ref={confirmRef}
					error={errors.passwordConfirm?.message || ''}
					formProps={{
						name: 'passwordConfirm',
						control: control as unknown as Control,
						rules: {
							required: 'Confirmação de senha é obrigatória',
							validate: validatePasswordConfirm,
						},
					}}
					inputProps={{
						placeholder: 'Confirme sua senha',
						returnKeyType: 'send',
						onSubmitEditing: handleSubmit(handleCadastrar),
						editable: !loading,
					}}
					secureTextEntry={true}
				/>
			</View>

			<View style={stylesCadastroFinal.buttonContainer}>
				<Button
					title="Cadastrar"
					onPress={handleSubmit(handleCadastrar)}
					iconName="user"
					disabled={loading}
					size={22}
					fontSize={16}
					styles={{ height: 55, width: 130 }}
				/>
			</View>
		</View>
	);
};

export default CadastroFinal;
