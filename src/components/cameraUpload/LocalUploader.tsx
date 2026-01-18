// Local server uploader – placeholder implementation.
//
// In a real project you would replace the body of `uploadToLocalServer`
// with the appropriate API call (e.g., POST to your backend).
// The function mirrors the signature of the S3 uploader so it can be
// used interchangeably by `CameraUpload`.

import { Alert } from 'react-native';
import { fetchPresignedUrl } from '../../api/s3'; // keep import for possible future use
import { uploadToS3 } from '../../utils/file'; // placeholder – replace with real logic

export async function uploadToLocalServer(uri: string) {
  try {
    // Placeholder: just log the URI and show a success alert.
    console.log('Uploading to local server:', uri);

    // Example of a typical fetch (uncomment & adapt as needed):
    // const response = await fetch('http://localhost:3000/upload', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ uri }),
    // });
    // const result = await response.json();
    // const publicUrl = result.url;

    // For now we simulate success by re‑using the S3 stub logic:
    const fileName = uri.split('/').pop() ?? `photo_${Date.now()}.jpg`;
    const presignedUrl = await fetchPresignedUrl(fileName, 'image/jpeg');
    await uploadToS3(presignedUrl, uri);
    const publicUrl = presignedUrl.split('?')[0];

    Alert.alert('✅ Upload local concluído', publicUrl);
  } catch (e) {
    console.error(e);
    Alert.alert('❌ Erro no upload local', (e as Error).message);
  }
}
