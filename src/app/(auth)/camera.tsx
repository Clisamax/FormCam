import {
	CameraCapturedPicture,
	CameraView,
	CameraViewProps,
	useCameraPermissions,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

const Camera: React.FC = () => {
	const cameraViewRef = React.useRef<CameraView>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [flash, setFhash] = useState('off');

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={{ flex: 1 }}>
				<Text style={{ alignItems: 'center', paddingBottom: 12 }}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	const takePhoto = async () => {
		if (cameraViewRef.current) {
			try {
				const photo: CameraCapturedPicture | undefined =
					await cameraViewRef.current.takePictureAsync();
				console.log(photo);

				if (photo) {
					const folderPath: string = `${FileSystem.documentDirectory}/.photos`;
					const filePath: string = `${folderPath}/photo_${Date.now()}.jpg`;

					// Certifique-se de que o diretório existe
					const dirInfo = await FileSystem.getInfoAsync(folderPath);
					if (!dirInfo.exists) {
						await FileSystem.makeDirectoryAsync(folderPath, {
							intermediates: true,
						});
					}

					// Mover a foto no diretório
					await FileSystem.moveAsync({
						from: photo.uri,
						to: filePath,
					});

					Alert.alert('Foto salva!', `Location: ${filePath}`);
				}
			} catch (error) {
				Alert.alert('Error', 'Erro ao salvar a foto:');
				console.error(error);
			}
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<CameraView
				style={{ flex: 1 }}
				ref={cameraViewRef}
				flash={flash as CameraViewProps['flash']}
			/>
			<View style={{ position: 'absolute' }}>{''}</View>
		</View>
	);
};

export default Camera;
