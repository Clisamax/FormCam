import AWS from 'aws-sdk';
/* crie um componente tsx react native com expo câmera usando o câmera view do expo camera, adicione a função de salvar a foto localmente e no S3 da AWS. O componente deve solicitar permissão para usar a câmera, permitir tirar fotos, salvar localmente e fazer upload para o S3. Use hooks e boas práticas de programação. */

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
	accessKeyId: 'YOUR_ACCESS_KEY_ID',
	secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
	region: 'YOUR_AWS_REGION',
});

const Camera: React.FC = () => {
	const cameraRef = useRef<InstanceType<typeof CameraView> | null>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [flash, setFlash] = useState<CameraViewProps['flash']>('off');
	const [isCameraReady, setIsCameraReady] = useState(false);

	const handleCameraReady = useCallback(() => {
		console.log('Câmera inicializada com sucesso');
		setIsCameraReady(true);
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
						Bucket: 'YOUR_S3_BUCKET_NAME',
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
			<View
				style={{
					position: 'absolute',
					bottom: 20,
					left: 20,
					right: 20,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				{''}
			</View>
		</View>
	);
};

export default Camera;
