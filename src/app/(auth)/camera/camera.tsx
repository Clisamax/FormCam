import React, { useEffect, useRef, useState } from 'react';
import {
	Button,
	StyleSheet,
	Text,
	View,
	Image,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen() {
	const [hasCameraPermission, setHasCameraPermission] = useState<
		boolean | null
	>(null);
	const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(
		null,
	);
	const [photoUri, setPhotoUri] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const cameraRef = useRef<CameraView | null>(null);
	const isFocused = useIsFocused();

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const cameraStatus = await Camera.requestCameraPermissionsAsync();
				const mediaStatus = await MediaLibrary.requestPermissionsAsync();
				if (!mounted) return;
				setHasCameraPermission(cameraStatus.status === 'granted');
				setHasMediaPermission(mediaStatus.status === 'granted');
			} catch (e) {
				console.error(e);
			}
		})();
		return () => {
			mounted = false;
			// liberando estado ao desmontar
			setIsUploading(false);
		};
	}, []);

	const takePicture = async () => {
		if (!cameraRef.current) return;
		try {
			const photo = await cameraRef.current.takePictureAsync();
			setPhotoUri(photo.uri);

			if (hasMediaPermission) {
				await MediaLibrary.saveToLibraryAsync(photo.uri);
				Alert.alert('📸 Foto salva na galeria!');
			}

			await uploadPhoto(photo.uri);
		} catch (error) {
			console.error(error);
			Alert.alert('Erro', 'Não foi possível tirar a foto.');
		}
	};

	const uploadPhoto = async (uri: string) => {
		try {
			setIsUploading(true);

			const formData = new FormData();
			formData.append('file', {
				uri,
				name: `foto_${Date.now()}.jpg`,
				type: 'image/jpeg',
			} as unknown as Blob);

			// ATENÇÃO: substituir pela sua rota real de upload
			const response = await fetch('https://seu-backend.com/upload', {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (!response.ok) throw new Error('Falha no upload');

			const result = await response.json();
			Alert.alert(
				'✅ Upload concluído!',
				`Arquivo armazenado em: ${result.url}`,
			);
		} catch (error) {
			console.error(error);
			Alert.alert('Erro', 'Não foi possível enviar a imagem.');
		} finally {
			setIsUploading(false);
		}
	};

	// não renderiza câmera se a tela não estiver em foco (evita câmera ativa em background)
	if (!isFocused) return <View style={{ flex: 1 }} />;

	if (hasCameraPermission === null) return <View />;
	if (hasCameraPermission === false)
		return <Text>Permissão negada para câmera.</Text>;

	return (
		<View style={styles.container}>
			<CameraView style={styles.camera} ref={cameraRef}>
				<View style={styles.buttonContainer}>
					<Button title="Tirar Foto" onPress={takePicture} />
				</View>
			</CameraView>

			{photoUri && (
				<View style={styles.previewContainer}>
					<Text style={styles.previewText}>Prévia:</Text>
					<Image source={{ uri: photoUri }} style={styles.previewImage} />
					{isUploading && <ActivityIndicator size="large" color="#fff" />}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#000' },
	camera: { flex: 1 },
	buttonContainer: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
	previewContainer: { alignItems: 'center', marginVertical: 10 },
	previewText: { color: '#fff', fontSize: 16, marginBottom: 10 },
	previewImage: { width: 300, height: 400, borderRadius: 10 },
});