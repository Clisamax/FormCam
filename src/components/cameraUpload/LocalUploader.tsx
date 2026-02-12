import { uploadToImmich } from '@/utils/immich';
import { Alert } from 'react-native';

export async function uploadToLocalServer(uri: string) {
	try {
		console.log('Uploading to local server (Immich):', uri);

		const immichUrl = process.env.EXPO_PUBLIC_IMMICH_URL;
		const immichKey = process.env.EXPO_PUBLIC_IMMICH_API_KEY;

		if (!immichUrl || !immichKey) {
			Alert.alert(
				'Erro de Configuração',
				'URL ou API Key do Immich não configuradas.',
			);
			return;
		}

		await uploadToImmich(uri, immichKey, immichUrl);
		Alert.alert('Sucesso', 'Foto enviada para o Immich com sucesso!');
	} catch (e) {
		console.error(e);
		Alert.alert('❌ Erro no upload para o Immich', (e as Error).message);
	}
}
