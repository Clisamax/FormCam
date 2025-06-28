import { router } from 'expo-router';
import { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/formsData';

import { styles } from '@/styles/auth/stylesOcorrencia';
import Input from '@/components/inputAnotacao/inputAnotacao';
import RadioField from '@/components/inputRadio/radioField';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';

export function retorn() {
	router.back();
}

const Ocorrencia: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origem = getValues('options_1');
	const processo = getValues('options_2');
	const procedimento = getValues('options_3');
	const responsavel = getValues('options_4');
	const ocorrencia = getValues('options_5');
	const anotacao = getValues('anotacao');

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

			<View style={[styles.containerMid]}>
				<View style={styles.containerMidLeft}>
					<Text
						style={[
							styles.text,
							{ textAlign: 'center', color: COLORS.red[500] },
						]}
					>
						{`${origem}`}
					</Text>
					<Text style={[styles.text, { textAlign: 'center' }]}>
						{`${processo}`}
					</Text>
				</View>
				<View style={styles.containerMidRight}>
					<Text style={[styles.text, { textAlign: 'center' }]}>
						Selecione a opção desejada para continuar
					</Text>
				</View>
			</View>
			<View style={styles.containerFoot}>
				<RadioField
					name="options_5"
					control={control as unknown as Control}
					options={[
						{ label: 'Depósito', value: 'Depósito' },
						{ label: 'Transportadora', value: 'Transportadora' },
						{ label: 'Fábrica', value: 'Fábrica' },
					]}
					//label="Selecione a area de avaria"
					rules={{ required: 'Este campo é obrigatório' }}
				/>
				<Input
					error={''}
					formProps={{
						name: 'anotacao',
						control: control as unknown as Control,
						rules: undefined,
					}}
					inputProps={{ placeholder: 'detalhes da ocorrencia' }}
				/>
				<Button
					title={'enviar'}
					onPress={() => {
						console.log('options_5', getValues('options_5'));
						console.log('anotacao', getValues('anotacao'));
						router.navigate('/(auth)/forms/revisao');
					}}
				/>
			</View>
		</View>
	);
};
export default Ocorrencia;
