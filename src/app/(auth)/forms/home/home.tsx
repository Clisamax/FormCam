import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { Control, useFormContext } from 'react-hook-form';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { homeFormData } from '@/@types/types';
import Button from '@/components/button/button';
import Input from '@/components/input/input';
import RadioField from '@/components/inputRadio/radioField';
import { styles } from '@/styles/auth/home/stylesHome';

import { AuthContext } from '@/context/auth';
import { COLORS } from '@/styles/global/color';

const Home = (data: homeFormData) => {
	const { Logout, user } = useContext(AuthContext);

	const [loading, setLoading] = useState(false);

	const {
		control,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useFormContext<homeFormData>();

	function uuid(data: homeFormData) {
		if (data.options_2 === 'Expedição') {
			router.push('/(auth)/forms/operation/dispatch');
		} else if (data.options_2 === 'Recepção') {
			router.push('/(auth)/forms/operation/reception');
		} else if (data.options_2 === 'Mov. Interna') {
			router.push('/(auth)/forms/operation/internalMovement');8
		}
		console.log(data);
	}
	return (
		//<Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
		<View style={styles.container}>
			<View style={styles.containerTop}>
				<Button
					iconName="logout"
					title="logout"
					onPress={Logout}
					variant="outline"
					styles={{ height: 50, width: 100 }}
					fontSize={12}
					size={14}
					disabled={loading}
				/>
				<View style={styles.containerTopText}>
					<Text style={styles.topTextName}>
						<Text style={styles.text}>Olá</Text> {` ${user?.name}`}{' '}
						<Text style={{ color: COLORS.gray[400] }}> {`${user?.sap}`}</Text>
					</Text>
					<Text
						style={[
							styles.text,
							{ justifyContent: 'center', textAlign: 'center' },
						]}
					>
						Sejá bem vindo
					</Text>
				</View>
			</View>
			<View
				style={{
					flex: 1,
					width: '95%',
				}}
			>
				<RadioField
					name="options_1"
					control={control as unknown as Control}
					options={[
						{ label: 'Depósito', value: 'Depósito' },
						{ label: 'Descarga', value: 'Descarga' },
						{ label: 'Devolução', value: 'Devolução' },
					]}
					rules={{ required: 'Este campo é obrigatório' }}
				/>
				<View style={[styles.containerInput, { marginRight: 15 }]}>
					<Input
						icon="file"
						error={errors.uuid?.message || ''}
						formProps={{
							name: 'uuid',
							control: control as unknown as Control,
							rules: {
								required: 'UUID é obrigatório',
								pattern: {
									value: /^[0-9]{18}$/,
									message: 'UUID deve conter 18 dígitos',
								},
							},
						}}
						inputProps={{
							placeholder: 'Digite o uuid',
							maxLength: 18,
							returnKeyType: 'next',
							editable: !loading,
						}}
					/>
					<RadioField
						name="options_2"
						control={control as unknown as Control}
						options={[
							{ label: 'Recepção', value: 'Recepção' },
							{ label: 'Expedição', value: 'Expedição' },
							{ label: 'Mov. Interna', value: 'Mov. Interna' },
						]}
						rules={{ required: 'Este campo é obrigatório' }}
					/>
				</View>
				<View style={styles.containerBotton}>
					<Button
						title="UUID"
						onPress={handleSubmit(uuid)}
						disabled={loading}
						iconName="rightcircle"
						size={22}
					/>
					<Button
						title="Camera"
						onPress={() => router.push('/(auth)/camera/cameraScreen')}
						disabled={loading}
						iconName="rightcircle"
						size={22}
					/>
				</View>
			</View>
		</View>
		//</Pressable>
	);
};

export default Home;
