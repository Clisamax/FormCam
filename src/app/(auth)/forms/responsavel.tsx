import { router } from 'expo-router';
import { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/formsData';

import { styles } from '@/styles/auth/stylesResponsavel';
import RadioTaskButton from '@/components/radioTaskButton/radioTaskButton';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';

export function retorn() {
	router.back();
}

const Responsavel: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origem = getValues('options_1');
	const processo = getValues('options_2');
	const procedimento = getValues('options_3');
	const responsavel = getValues('options_4');

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
					<Progress progress={66} />
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

			<ScrollView style={styles.containerFoot}>
				<RadioTaskButton
					name="options_4"
					control={control as unknown as Control}
					options={[
						{
							label: 'Carregamento frabrica',
							value: 'Carregamento frabrica',
						},
						{
							label: 'Conduçåo de veiculo',
							value: 'Conduçåo de veiculo',
						},

						{
							label: 'Vicio de embalagem',
							value: 'Vicio de embalagem',
						},
						{
							label: 'Operador de descarga',
							value: 'Operador de descarga',
						},
						{
							label: 'Operador de armazenamento',
							value: 'Operador de armazenamento',
						},
						{
							label: 'Operador de ressuprimento',
							value: 'Operador de ressuprimento',
						},
						{
							label: 'Operador de remanejamento',
							value: 'Operador de remanejamento',
						},
						{
							label: 'Operador de expediçåo',
							value: 'Operador de expediçåo',
						},
						{
							label: 'Auxiliar de picking',
							value: 'Auxiliar de picking',
						},
						{
							label: 'Auxiliar de jet',
							value: 'Auxiliar de jet',
						},
						{
							label: 'Outros',
							value: 'Outros',
						},
					]}
					label="Selecione uma opção"
					rules={{ required: 'Este campo é obrigatório' }}
					onPress={() => {
						router.push('/(auth)/forms/ocorrencia');
						console.log('options_3:', getValues('options_3'));
						console.log('options_4:', getValues('options_4'));
					}}
				/>

				<View style={styles.containerFootButton}>{''}</View>
			</ScrollView>
		</View>
	);
};
export default Responsavel;
