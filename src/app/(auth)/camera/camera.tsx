import { COLORS } from '@/styles/global/color';
import { FONTES } from '@/styles/global/fontes';
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
	StyleSheet,
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
			</View>
			{!isCameraReady && (
				<View style={styles.overlay}>
					<Text style={styles.overlayText}>Inicializando câmera...</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	fullScreenContainer: {
		flex: 1,
		backgroundColor: '#000',
		position: 'relative',
	},
	camera: {
		flex: 1,
		width: '100%',
		height: '100%',
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 40,
		alignSelf: 'center',
		zIndex: 10,
	},
	button: {
		backgroundColor: COLORS.red[700],
		padding: 15,
		borderRadius: 25,
		width: 80,
		alignSelf: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		backgroundColor: COLORS.gray[400],
		opacity: 0.6,
	},
	text: {
		fontFamily: FONTES.FONTS.button,
		color: COLORS.white,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.7)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 5,
	},
	overlayText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
	},
	loadingText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
		textAlign: 'center',
		marginTop: 50,
	},
	permissionText: {
		color: COLORS.white,
		fontSize: 16,
		fontFamily: FONTES.FONTS.default,
		textAlign: 'center',
		marginBottom: 20,
		paddingHorizontal: 20,
	},
});

export default Camera;
