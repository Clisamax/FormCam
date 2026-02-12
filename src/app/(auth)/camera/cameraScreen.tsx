import AWS from 'aws-sdk';
import { Buffer } from 'buffer';
import {
	CameraCapturedPicture,
	CameraView,
	CameraViewProps,
	useCameraPermissions,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Button, StatusBar, Text, View } from 'react-native';

const s3 = new AWS.S3({
	accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
	region: process.env.EXPO_PUBLIC_AWS_REGION,
});

import FloatingOrbitButton, {
	OrbitAction,
} from '@/components/floatingOrbitButton';
import { router } from 'expo-router';

const Camera: React.FC = () => {
	const cameraRef = useRef<InstanceType<typeof CameraView> | null>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [flash, setFlash] = useState<CameraViewProps['flash']>('off');
	const [isCameraReady, setIsCameraReady] = useState(false);

	const handleCameraReady = useCallback(() => {
		console.log('Câmera inicializada com sucesso');
		setIsCameraReady(true);
	}, []);

	const toggleFlash = useCallback(() => {
		setFlash((prev) => {
			if (prev === 'off') return 'on';
			if (prev === 'on') return 'auto';
			return 'off';
		});
	}, []);

	const takePhoto = useCallback(async () => {
		if (cameraRef.current && isCameraReady) {
			try {
				const pictureRef = await cameraRef.current?.takePictureAsync();
				let photo: CameraCapturedPicture | undefined;

				if (pictureRef) {
					photo = pictureRef;
				}
				if (photo) {
					//save photo locally
					const folderPath: string = `${FileSystem.documentDirectory}/.photos`;
					const filePath: string = `${folderPath}/photo_${Date.now()}.jpg`;
					const dirInfo = await FileSystem.getInfoAsync(folderPath);
					if (!dirInfo.exists) {
						await FileSystem.makeDirectoryAsync(folderPath, {
							intermediates: true,
						});
					}
					await FileSystem.moveAsync({
						from: photo.uri,
						to: filePath,
					});
					Alert.alert('Foto salva localmente!', `Local: ${filePath}`);

					//upload to S3
					const fileContent = await FileSystem.readAsStringAsync(filePath, {
						encoding: FileSystem.EncodingType.Base64,
					});
					const buffer = Buffer.from(fileContent, 'base64');

					const params = {
						Bucket:
							process.env.EXPO_PUBLIC_AWS_S3_BUCKET || 'YOUR_S3_BUCKET_NAME',
						Key: `photos/photo_${Date.now()}.jpg`,
						Body: buffer,
						ContentType: 'image/jpeg',
					};

					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					s3.upload(params, (err: any, data: { Location: any }): void => {
						if (err) {
							Alert.alert('Erro', 'Erro ao fazer upload para o S3.');
							console.error('Erro ao fazer upload para o S3:', err);
						} else {
							Alert.alert('Upload bem-sucedido!', `URL: ${data.Location}`);
						}
					});
				}
			} catch (error) {
				Alert.alert('Erro', 'Erro	 ao salvar a foto.');
				console.error('Erro ao tirar foto:', error);
			}
		} else {
			Alert.alert('Câmera não pronta', 'A câmera ainda não está pronta.');
		}
	}, [isCameraReady]);

	// MODIFIQUE AQUI: Configure os ícones e funções dos botões que aparecem em volta do botão principal
	const orbitActions: OrbitAction[] = [
		{
			iconName: 'home',
			iconFamily: 'FontAwesome',
			onPress: () => router.back(),
		},
		{
			iconName:
				flash === 'off'
					? 'flash-off'
					: flash === 'on'
						? 'flash-on'
						: 'flash-auto',
			iconFamily: 'MaterialIcons',
			onPress: toggleFlash,
		},
		{
			iconName: 'camera',
			iconFamily: 'FontAwesome',
			onPress: takePhoto,
		},
	];

	if (!permission || !permission.granted) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Precisamos de permissão para usar a câmera</Text>
				<Button title="Conceder Permissão" onPress={requestPermission} />
			</View>
		);
	}
	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden />
			<CameraView
				ref={cameraRef}
				style={{ flex: 1 }}
				flash={flash}
				onCameraReady={handleCameraReady}
			/>

			<FloatingOrbitButton
				actions={orbitActions}
				containerStyle={{ bottom: 40, right: 30 }}
			/>
		</View>
	);
};

export default Camera;
