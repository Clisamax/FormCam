import { router } from 'expo-router';
import React, { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/formsData';
import { styles } from '@/styles/auth/stylesRecepcao';
import RadioTaskButton from '@/components/radioTaskButton/radioTaskButton';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';

export function retorn() {
	router.back();
}

const Recepcao: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origem = getValues('options_1');
	const processo = getValues('options_2');
	const procedimento = getValues('options_3');

	return (
		<View style={styles.container}>
			<View style={styles.containerTop}>
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
					<Progress progress={33} />
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

			<View style={styles.containerMid}>
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
				<RadioTaskButton
					name="options_3"
					control={control as unknown as Control}
					options={[
						{ label: 'Durante a descarga', value: 'Durante a descarga' },
						{
							label: 'Avaria detectada no ato da descarga',
							value: 'Avaria detectada no ato da descarga',
						},
						{
							label: 'Movimentaçåo do produto do caminhao para a ilha',
							value: 'Movimentaçåo do produto do caminhao para a ilha',
						},
					]}
					label="Selecione uma opção"
					rules={{ required: 'Este campo é obrigatório' }}
					onPress={() => {
						router.push('/(auth)/forms/responsavel');
						console.log('options_3:', getValues('options_3'));
					}}
				/>
				<View style={styles.containerFootButton}>{''}</View>
			</View>
		</View>
	);
};
export default Recepcao;
