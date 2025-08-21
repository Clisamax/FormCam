import { router } from 'expo-router';
import { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';

import { homeFormData } from '@/@types/types';
import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import RadioTaskButton from '@/components/radioTaskButton/radioTaskButton';
import { AuthContext } from '@/context/auth';

import { styles } from '@/styles/auth/stylesInternalMovement';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fonts';

export function retorn() {
	router.back();
}

const InternalMovement: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origin = getValues('options_1');
	const process = getValues('options_2');
	const procedure = getValues('options_3');

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
						<Text style={[styles.text, { fontWeight: 'bold' }]}>
							Qual o departamento de origem?
						</Text>
						<Text
							style={[styles.text, { color: COLORS.red[500] }]}
						>{`=> ${origin}`}</Text>
					</Text>
					<Text style={[styles.text, { textAlign: 'center' }]}>
						<Text style={[styles.text, { fontWeight: 'bold' }]}>
							Qual o procedimento?
						</Text>
						<Text
							style={[styles.text, { color: COLORS.red[500] }]}
						>{`=> ${procedure}`}</Text>
					</Text>
				</View>
				<View style={styles.containerMidRight}>
					<Text style={[styles.text, { textAlign: 'center' }]}>
						Selecione a opção desejada para continuar
					</Text>
				</View>
			</View>
			<ScrollView style={styles.containerFoot}>
				<RadioTaskButton
					name="options_3"
					control={control as unknown as Control}
					options={[
						{ label: 'Durante o picking', value: 'Durante o picking' },
						{
							label: 'Durante a ressuprimento',
							value: 'Durante a ressuprimento',
						},
						{
							label: 'Durante o armazenamento',
							value: 'Durante o armazenamento',
						},
						{
							label: 'Durante o repanejamento',
							value: 'Durante o repanejamento',
						},
						{
							label: 'Avaria detectada na posiçåo',
							value: 'Avaria detectada na posiçåo',
						},
					]}
					label="Selecione uma opção"
					rules={{ required: 'Este campo é obrigatório' }}
					onPress={() => {
						router.push('/(auth)/forms/responsible');
						console.log('options_3:', getValues('options_3'));
					}}
				/>

				<View style={styles.containerFootButton}>{''}</View>
			</ScrollView>
		</View>
	);
};
export default InternalMovement;
