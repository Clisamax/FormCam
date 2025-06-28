import { router } from 'expo-router';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/formsData';
import { styles } from '@/styles/auth/stylesRevisao';
import { api } from '@/services/api';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';
import { AxiosError } from 'axios';

const Revisao: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origem = getValues('options_1');
	const processo = getValues('options_2');
	const procedimento = getValues('options_3');
	const responsavel = getValues('options_4');
	const ocorrencia = getValues('options_5');

	async function handleEnviar(data: homeFormData) {
		try {
			const formData = {
				uuid: data.uuid.trim(),
				origem: data.options_1,
				processo: data.options_2,
				procedimento: data.options_3,
				responsavel: data.options_4,
				ocorrencia: data.options_5,
				anotacao: data.anotacao,
			};

			const response = await api.post('/create_ocorrencia', formData);

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
	return (
		<View style={styles.container}>
			<View style={[styles.containerTop]}>
				<View style={[styles.containerTopLefth, { padding: 10 }]}>
					<Button
						iconName="back"
						title="retornar"
						onPress={() => router.back()}
						variant="outline"
						styles={{ height: 50, width: 100 }}
						fontSize={12}
						size={14}
					/>
				</View>
				<View style={styles.containerTopRight}>
					<Text>
						<Text style={styles.topTextName}>
							<Text style={styles.text}>Olá</Text> {` ${user?.name}`}{' '}
							<Text style={{ color: COLORS.gray[400] }}> {`${user?.sap}`}</Text>
						</Text>
					</Text>
					<Progress progress={100} />
					<Text style={[styles.textSpace, { color: COLORS.red[500] }]}>
						<Text
							style={{
								color: COLORS.gray[600],
								fontFamily: FONTES.FONTS.defaultBold,
							}}
						>
							UUID {''}
						</Text>
						{`${uuid}`}
					</Text>
				</View>
			</View>
			<View style={[styles.containerMid, { marginLeft: 10 }]}>
				<Text style={[styles.textBold]}>Qual o departamento de origem?</Text>
				<Text style={styles.textRed}>{`=> ${origem}`}</Text>
				<Text style={styles.textBold}>Qual o processo?</Text>
				<Text style={styles.textRed}>{`=> ${processo}`}</Text>
				<Text style={styles.textBold}>Qual o procedimento?</Text>
				<Text style={styles.textRed}>{`=> ${procedimento}`}</Text>
				<Text style={styles.textBold}>Responsavel pela avaria ?</Text>
				<Text style={styles.textRed}>{`=> ${responsavel}`}</Text>
				<Text style={styles.textBold}>Qual o responsável pela ocorrência?</Text>
				<Text style={styles.textRed}>{`=> ${ocorrencia}`}</Text>
			</View>
			<View style={[styles.containerFoot]}>
				<Button title={'enviar'} onPress={handleSubmit(handleEnviar)} />
			</View>
		</View>
	);
};
export default Revisao;
