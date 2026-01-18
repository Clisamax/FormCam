import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

type Props = {
  /** URI da imagem que deve ser salva na galeria. */
  uri: string | null;
  /** Se true, a foto será salva na galeria. */
  saveToGallery: boolean;
};

/**
 * Componente responsável por solicitar permissão e salvar a foto na galeria.
 * Não renderiza nada na UI.
 */
export default function SaveToGallery({ uri, saveToGallery }: Props) {
  // Solicita permissão ao montar ou quando o flag mudar
  useEffect(() => {
    if (saveToGallery) {
      (async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'É preciso conceder acesso à galeria para salvar fotos.'
          );
        }
      })();
    }
  }, [saveToGallery]);

  // Quando a URI da imagem está disponível e a flag está ativa,
  // cria o asset na galeria.
  useEffect(() => {
    if (saveToGallery && uri) {
      (async () => {
        try {
          await MediaLibrary.createAssetAsync(uri);
        } catch (e) {
          console.error('Erro ao salvar foto na galeria:', e);
        }
      })();
    }
  }, [uri, saveToGallery]);

  return null;
}
