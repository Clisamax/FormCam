import { fetchPresignedUrl } from '../../api/s3';
import { uploadToS3 } from '../../utils/file';
import { Alert } from 'react-native';

/**
 * Upload an image to AWS S3 using a presigned URL.
 * @param uri Local file URI (cached image)
 */
export async function uploadToS3Server(uri: string) {
  try {
    const fileName = uri.split('/').pop() ?? `photo_${Date.now()}.jpg`;
    const presignedUrl = await fetchPresignedUrl(fileName, 'image/jpeg');
    await uploadToS3(presignedUrl, uri);
    const publicUrl = presignedUrl.split('?')[0];
    Alert.alert('✅ Upload concluído', publicUrl);
  } catch (e) {
    console.error(e);
    Alert.alert('❌ Erro', (e as Error).message);
  }
}
