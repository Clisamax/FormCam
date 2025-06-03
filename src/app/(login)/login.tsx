import { useRouter } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import Button from '@/components/button/button';
import Input from '@/components/input/input';
import InputSenha from '@/components/inputSenha/inputSenha';
import NavLink from '@/components/navLink/navLink';
import { AuthContext } from '@/context/auth';

import { LoginFormData } from '@/@types/loginTypes';
import { COLORS } from '@/styles/global/color';
import { styles } from '@/styles/login/stylesLogin';

const Login: React.FC = () => {
	const router = useRouter();
	const { Authenticate } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const passwordRef = useRef<TextInput>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		defaultValues: {
			sap: '',
			password: '',
		},
	});

	const handleLogin = async (data: LoginFormData) => {
		try {
			setLoading(true);
			await Authenticate(data.sap, data.password);
			router.navigate('/(auth)/loading');
		} catch (error) {
			Alert.alert('Erro', 'Usuário ou senha inválidos');
			router.push('/(login)/login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<Input
					icon="user"
					error={errors.sap?.message || ''}
					formProps={{
						name: 'sap',
						control: control as unknown as Control,
						rules: {
							required: 'SAP é obrigatório',
							pattern: {
								value: /^[0-9]{8}$/,
								message: 'SAP deve conter 8 dígitos',
							},
						},
					}}
					inputProps={{
						placeholder: 'Digite seu SAP',
						maxLength: 8,
						onSubmitEditing: () => passwordRef.current?.focus(),
						returnKeyType: 'next',
						editable: !loading,
					}}
				/>

				<InputSenha
					icon="eye"
					error={errors.password?.message || ''}
					ref={passwordRef}
					formProps={{
						name: 'password',
						control: control as unknown as Control,
						rules: {
							required: 'Senha é obrigatória',
							pattern: {
								value:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
								message: 'Senha inválida',
							},
						},
					}}
					inputProps={{
						placeholder: 'Digite sua senha',
						returnKeyType: 'send',
						onSubmitEditing: handleSubmit(handleLogin),
						editable: !loading,
					}}
					secureTextEntry={true}
				/>
			</View>

			<View style={styles.footer}>
				<Button
					title="Entrar"
					onPress={handleSubmit(handleLogin)}
					disabled={loading}
					iconName="login"
					styles={{ height: 55, width: 130 }}
				/>
				<View style={styles.registerContainer}>
					<Text style={styles.registerText}>
						Não tem uma conta?
						<NavLink
							href="/(login)/cadastro"
							style={{ color: COLORS.red[500] }}
						>
							{' '}
							cadastre-se já
						</NavLink>
					</Text>
				</View>
			</View>
		</View>
	);
};

export default Login;
