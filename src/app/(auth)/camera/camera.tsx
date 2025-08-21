import FlatButtonAnimated from '@/components/flatButton';
import { styles } from '@/styles/auth/stylesCamera';
import {
	CameraCapturedPicture,
	CameraView,
	CameraViewProps,
	useCameraPermissions,
} from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useState } from 'react';
import {
	Alert,
	Button,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Camera: React.FC = () => {
	const cameraViewRef = React.useRef<CameraView>(null);
	const [permission, requestPermission] = useCameraPermissions();
	const [flash, setFlash] = useState<CameraViewProps['flash']>('off');
	const [isCameraReady, setIsCameraReady] = useState(false);

	const handleCameraReady = useCallback(() => {
		console.log('Câmera inicializada com sucesso');
		setIsCameraReady(true);
	}, []);

	const takePhoto = useCallback(async () => {
		if (cameraViewRef.current && isCameraReady) {
			try {
				const photo: CameraCapturedPicture | undefined =
					await cameraViewRef.current.takePictureAsync({
						quality: 0.8,
						base64: false,
					});
				if (photo) {
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
					Alert.alert('Foto salva!', `Local: ${filePath}`);
				}
			} catch (error) {
				Alert.alert('Erro', 'Erro ao salvar a foto.');
				console.error('Erro ao tirar foto:', error);
			}
		} else {
			Alert.alert('Aguarde', 'A câmera ainda não está pronta.');
		}
	}, [isCameraReady]);

	if (!permission) {
		// Carregando permissões
		return (
			<View style={styles.fullScreenContainer}>
				<StatusBar barStyle="light-content" backgroundColor="#000" />
				<Text style={styles.loadingText}>Carregando permissões...</Text>
			</View>
		);
	}

	if (!permission.granted) {
		// Permissão não concedida
		return (
			<View style={styles.fullScreenContainer}>
				<StatusBar barStyle="light-content" backgroundColor="#000" />
				<Text style={styles.permissionText}>
					Precisamos da sua permissão para acessar a câmera
				</Text>
				<Button onPress={requestPermission} title="Conceder permissão" />
			</View>
		);
	}

	return (
		<View style={styles.fullScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor="#000" />
			<CameraView
				style={styles.camera}
				facing="back"
				ref={cameraViewRef}
				flash={flash}
				onCameraReady={handleCameraReady}
			/>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, !isCameraReady && styles.buttonDisabled]}
					onPress={takePhoto}
					disabled={!isCameraReady}
					activeOpacity={0.8}
				>
					<Text style={styles.text}>Click</Text>
				</TouchableOpacity>
				<FlatButtonAnimated />
			</View>
			{!isCameraReady && (
				<View style={styles.overlay}>
					<Text style={styles.overlayText}>Inicializando câmera...</Text>
				</View>
			)}
		</View>
	);
};

export default Camera;
