import Button from '@/components/buttonVariants/buttonVariant';
import { CameraView } from 'expo-camera';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, View } from 'react-native';

import { AuthContext } from '@/context/auth';
import { useCamera } from '@/hooks/useCamera';
import { moveToCache } from '@/utils/file';
import { resizeImage } from '@/utils/image';
import { uploadToImmich } from '@/utils/immich';

import CameraButton from '@/components/buttonCamera/button';
import { uploadToLocalServer } from '@/components/cameraUpload/LocalUploader';
import { uploadToS3Server } from '@/components/cameraUpload/S3Uploader';
import SaveToGallery from '@/components/cameraUpload/SaveToGallery';
import { colors, styles } from '@/styles/auth/camera/styles';

type Props = {
	/** Quando verdadeiro, a imagem é carregada em um servidor de desenvolvimento local.
	 * Quando falso (padrão), a imagem é carregada no AWS S3 por meio de um URL pré-assinado. */
	useLocal?: boolean;
	/** Quando true, a foto tirada será salva na galeria do dispositivo antes do upload. */
	saveToGallery?: boolean;
};

function CameraUpload({
	useLocal = false,
	saveToGallery: externalSaveToGallery = false,
}: Props) {
	// Automaticamente salva na galeria quando usando Immich
	const saveToGallery =
		externalSaveToGallery ||
		(!!useContext(AuthContext).immichApiKey &&
			!!useContext(AuthContext).immichUrl);
	const {
		cameraRef,
		permission,
		requestPermission,
		flash,
		onCameraReady,
		ensureReady,
		checkPermission,
	} = useCamera();

	const [processing, setProcessing] = useState(false);
	const [savedUri, setSavedUri] = useState<string | null>(null);
	const { immichApiKey, immichUrl } = useContext(AuthContext);

	// Verifica permissão automaticamente quando o componente monta
	useEffect(() => {
		const initializeCamera = async () => {
			if (!permission) {
				await checkPermission();
			}
		};
		initializeCamera();
	}, [permission, checkPermission]);

	const takeAndUpload = useCallback(async () => {
		if (!ensureReady()) return;

		try {
			setProcessing(true);

			// 1️⃣ Capture raw image
			if (!cameraRef.current) {
				throw new Error('Camera not ready');
			}
			const raw = await cameraRef.current.takePictureAsync({
				quality: 0.8,
				base64: false,
			});

			// 2️⃣ Resize
			const resized = await resizeImage(raw.uri);

			// 3️⃣ Move to a cache/document location (stub currently returns the same URI)
			const cachedUri = await moveToCache(resized.uri);

			// 4️⃣ Delegate upload – either S3 or local based on prop
			if (saveToGallery) {
				setSavedUri(cachedUri);
			}
			if (useLocal) {
				await uploadToLocalServer(cachedUri);
			} else if (immichApiKey && immichUrl) {
				await uploadToImmich(cachedUri, immichApiKey, immichUrl);
				Alert.alert(
					'✅ Sucesso',
					'Upload para o Immich realizado com sucesso!',
				);
				// Garante que a foto seja salva na galeria após o upload bem-sucedido para Immich
				if (saveToGallery && !savedUri) {
					setSavedUri(cachedUri);
				}
			} else {
				await uploadToS3Server(cachedUri);
			}
		} catch (e) {
			console.error(e);
			Alert.alert('❌ Erro', (e as Error).message);
		} finally {
			setProcessing(false);
		}
	}, [
		ensureReady,
		cameraRef,
		useLocal,
		saveToGallery,
		immichApiKey,
		immichUrl,
		savedUri,
	]);

	// -----------------------------------------------------------------
	// Renderização
	// -----------------------------------------------------------------
	if (!permission?.granted) {
		return (
			<View style={styles.center}>
				<Button title="permitir" onPress={requestPermission} />
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
					<CameraButton onPress={takeAndUpload} />
				)}
			</View>
			<SaveToGallery uri={savedUri} saveToGallery={saveToGallery} />
		</View>
	);
}

export default CameraUpload;
