import { router } from 'expo-router';
import { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/formsData';
import { styles } from '@/styles/auth/stylesExpedicao';
import RadioTaskButton from '@/components/radioTaskButton/radioTaskButton';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';

export function retorn() {
	router.back();
}

const Expedicao: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const options_1 = getValues('options_1');
	const options_2 = getValues('options_2');
	const options_3 = getValues('options_3');

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
						{`${options_1}`}
					</Text>
					<Text style={[styles.text, { textAlign: 'center' }]}>
						{`${options_2}`}
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
						{
							label: 'Avaria detectada na posiçåo',
							value: 'Avaria detectada na posiçåo',
						},
						{
							label: 'Durante o carregamento',
							value: 'Durante o carregamento',
						},
						{
							label: 'Movimentaçåo do produto da posiçåo para plataforma',
							value: 'Movimentaçåo do produto da posiçåo para plataforma',
						},
					]}
					label="Selecione uma opção"
					rules={{ required: 'Este campo é obrigatório' }}
					onPress={() => {
						router.push('/(auth)/responsavel');
						console.log('options_3:', getValues('options_3'));
					}}
				/>

				<View style={styles.containerFootButton}>{''}</View>
			</View>
		</View>
	);
};
export default Expedicao;
