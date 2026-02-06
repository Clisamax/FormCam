import { router } from 'expo-router';
import { useContext } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import Button from '@/components/buttonVariants/buttonVariant';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/types';
import RadioTaskButton from '@/components/radioTaskButton/radioTaskButton';
import { styles } from '@/styles/auth/operation/stylesDispatch';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fonts';

export function retorn() {
	router.back();
}

const Dispatch: React.FC<homeFormData> = (data) => {
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
						iconName="arrowleft"
						title="return"
						onPress={() => router.back()}
						variant="outline"
						styles={{ height: 60, width: 110 }}
						disabled={false}
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
				<View>
					<Text style={{ fontFamily: FONTES.FONTS.code }}>
						<Text
							style={{
								color: COLORS.red[600],
								fontFamily: FONTES.FONTS.defaultBold,
							}}
						>
							Origem :{' '}
						</Text>
						{`${origin} => ${process}`}
					</Text>
				</View>
				<Text style={[styles.text, { textAlign: 'center' }]}>
					Selecione a opção desejada para continuar
				</Text>
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
						router.push('/(auth)/forms/details/responsible');
						console.log(data);
					}}
				/>

				<View style={styles.containerFootButton}>{''}</View>
			</View>
		</View>
	);
};
export default Dispatch;
