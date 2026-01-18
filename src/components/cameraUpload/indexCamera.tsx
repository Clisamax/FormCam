// src/components/cameraUpload/indexCamera.tsx
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StatusBar,
  View,
} from 'react-native';
import { CameraView } from 'expo-camera';

import { moveToCache } from '@/utils/file';
import { resizeImage } from "@/utils/image";
import { useCamera } from '../../hooks/useCamera';

import { styles, colors } from './styles';
import SaveToGallery from './SaveToGallery';

// Upload helpers – one for AWS S3, one for a local server.
import { uploadToS3Server } from './S3Uploader';
import { uploadToLocalServer } from './LocalUploader';

type Props = {
 /** Quando verdadeiro, a imagem é carregada em um servidor de desenvolvimento local.
   * Quando falso (padrão), a imagem é carregada no AWS S3 por meio de um URL pré-assinado. */
  useLocal?: boolean;
  /** Quando true, a foto tirada será salva na galeria do dispositivo antes do upload. */
  saveToGallery?: boolean;
};

export default function CameraUpload({ useLocal = false, saveToGallery = false }: Props) {
  const {
    cameraRef,
    permission,
    requestPermission,
    flash,
    onCameraReady,
    ensureReady,
  } = useCamera();

  const [processing, setProcessing] = useState(false);
  const [savedUri, setSavedUri] = useState<string | null>(null);


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
      } else {
        await uploadToS3Server(cachedUri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('❌ Erro', (e as Error).message);
    } finally {
      setProcessing(false);
    }
  }, [ensureReady, cameraRef, useLocal, saveToGallery]);

  // -----------------------------------------------------------------
  // Renderização
  // -----------------------------------------------------------------
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
      <SaveToGallery uri={savedUri} saveToGallery={saveToGallery} />
    </View>
  );
}
