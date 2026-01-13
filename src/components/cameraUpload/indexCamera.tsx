// src/components/CameraUpload/CameraUpload.tsx
import React, { useCallback, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Button,
	StatusBar,
	View,
} from 'react-native';
import { CameraView } from 'expo-camera';

import { fetchPresignedUrl } from '../../api/s3';
import { moveToCache, uploadToS3 } from '../../utils/file';
import { resizeImage } from '../../utils/image';
import { useCamera } from '../../hooks/useCamera';

import { styles, colors } from './styles';

export default function CameraUpload() {
	const {
		cameraRef,
		permission,
		requestPermission,
		flash,
		onCameraReady,
		ensureReady,
	} = useCamera();

	const [processing, setProcessing] = useState(false);

	const takeAndUpload = useCallback(async () => {
		if (!ensureReady()) return;

		try {
			setProcessing(true);

			const raw = await cameraRef.current!.takePictureAsync({
				quality: 0.8,
				base64: false,
			});

			const resized = await resizeImage(raw.uri);
			const cachedUri = await moveToCache(resized.uri);
			const fileName = cachedUri.split('/').pop() ?? `photo_${Date.now()}.jpg`;

			const presignedUrl = await fetchPresignedUrl(fileName, 'image/jpeg');
			await uploadToS3(presignedUrl, cachedUri);

			const publicUrl = presignedUrl.split('?')[0];
			Alert.alert('✅ Upload concluído', publicUrl);
		} catch (e) {
			console.error(e);
			Alert.alert('❌ Erro', (e as Error).message);
		} finally {
			setProcessing(false);
		}
	}, [ensureReady, cameraRef]);

	// --------------------------------------------------------------
	// Render
	// --------------------------------------------------------------
	if (!permission?.granted) {
		return (
			<View style={styles.center}>
				<Button title="Conceder permissão" onPress={requestPermission} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<CameraView
				ref={cameraRef}
				style={styles.camera}
				flash={flash}
				onCameraReady={onCameraReady}
			/>
			<View style={styles.controls}>
				{processing ? (
					<ActivityIndicator size="large" color={colors.textPrimary} />
				) : (
					<Button title="Tirar foto + Upload" onPress={takeAndUpload} />
				)}
			</View>
		</View>
	);
}
