import {
	CameraCapturedPicture,
	CameraView,
	CameraViewProps,
	useCameraPermissions,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Button, StatusBar, Text, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

import { uploadToLocalServer } from '@/components/cameraUpload/LocalUploader';
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
					console.log('Foto salva localmente em:', filePath);

					// Upload para o Immich (via LocalUploader)
					await uploadToLocalServer(filePath);
					// save photo to gallery
					await MediaLibrary.createAssetAsync(filePath);
				}
			} catch (error) {
				Alert.alert('Erro', 'Erro ao processar a foto.');
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
