import { router } from 'expo-router';
import { useContext, useRef } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import {
	Keyboard,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import Button from '@/components/button/button';
import Progress from '@/components/progress/progress';
import { AuthContext } from '@/context/auth';

import { homeFormData } from '@/@types/types';

import Input from '@/components/inputAnnotation/inputAnnotation';
import RadioField from '@/components/inputRadio/radioField';
import { styles } from '@/styles/auth/stylesOccurrence';
import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fonts';

export function retorn() {
	router.back();
}

const Occurrence: React.FC<homeFormData> = (data) => {
	const { Logout, user } = useContext(AuthContext);
	const { control, handleSubmit, getValues } = useFormContext<homeFormData>();
	const uuid = getValues('uuid');
	const origin = getValues('options_1');
	const process = getValues('options_2');
	const procedure = getValues('options_3');
	const responsible = getValues('options_4');
	const occurrence = getValues('options_5');
	const annotation = getValues('annotation');
	const sapRef = useRef<TextInput>(null);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
								<Text style={{ color: COLORS.gray[400] }}>
									{' '}
									{`${user?.sap}`}
								</Text>
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
							name: 'annotation',
							control: control as unknown as Control,
							rules: undefined,
						}}
						inputProps={{
							placeholder: 'occurrence details',
							autoCapitalize: 'none',
							onSubmitEditing: () => sapRef.current?.focus(),
						}}
					/>
					<Button
						title={'enviar'}
						onPress={() => {
							router.navigate('/(auth)/forms/review');
							console.log('occurrence:', getValues('options_5'));
							console.log('annotation:', getValues('annotation'));
						}}
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};
export default Occurrence;
