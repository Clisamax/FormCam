import { router } from 'expo-router';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, Text, View, ScrollView } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/types';
import { api } from '@/services/api';
import { styles } from '@/styles/auth/details/stylesReview';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fonts';
import { AxiosError } from 'axios';


const Review: React.FC<homeFormData> = () => {
	const { user } = useContext(AuthContext);
	const { handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origin = getValues('options_1');
	const process = getValues('options_2');
	const procedure = getValues('options_3');
	const responsible = getValues('options_4');
	const occurrence = getValues('options_5');
	const annotation = getValues('annotation');

	async function handleEnviar(data: homeFormData) {
		try {
			const formData = {
				uuid: data.uuid.trim(),
				origin: data.options_1,
				process: data.options_2,
				procedure: data.options_3,
				responsible: data.options_4,
				occurrence: data.options_5,
				annotation: data.annotation,
			};

			const response = await api.post('/api/v1/occurrences', formData);

			if (response.status === 201) {
				Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
					{
						text: 'OK',
						onPress: () => router.push('/(auth)/forms/product'),
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
		console.log(data);
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
			<ScrollView style={[styles.containerMid, { marginLeft: 10 }]}>
				<Text style={[styles.text, { fontWeight: 'bold' }]}>
					Qual o departamento de origem?
				</Text>
				<Text
					style={[styles.text, { color: COLORS.red[500] }]}
				>{`=> ${origin}`}</Text>
				<Text style={styles.textBold}>Qual o processo?</Text>
				<Text style={styles.textRed}>{`=> ${process}`}</Text>
				<Text style={styles.textBold}>Qual o procedimento?</Text>
				<Text style={styles.textRed}>{`=> ${procedure}`}</Text>
				<Text style={styles.textBold}>Responsavel pela avaria ?</Text>
				<Text style={styles.textRed}>{`=> ${responsible}`}</Text>
				<Text style={styles.textBold}>Qual o responsável pela ocorrência?</Text>
				<Text style={styles.textRed}>{`=> ${occurrence}`}</Text>
				<Text style={styles.textBold}>Anotação:</Text>
				<Text style={styles.textRed}>{`=> ${annotation}`}</Text>
			</ScrollView>
			<View style={{ marginTop: 20, alignItems: 'center' }}>
				<Button title={'enviar'} onPress={handleSubmit(handleEnviar)} />
			</View>
		</View>
	);
};
export default Review;
