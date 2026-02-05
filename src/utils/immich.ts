import axios from 'axios';
import { Platform } from 'react-native';

interface ImmichUploadResponse {
	id: string;
	[key: string]: any;
}

/**
 * Uploads an image to an Immich server.
 * 
 * @param imageUri The local URI of the image file.
 * @param apiKey The Immich API Key.
 * @param baseUrl The base URL of the Immich instance (e.g., https://immich.example.com).
 * @returns The response data from Immich.
 */
export async function uploadToImmich(
	imageUri: string,
	apiKey: string,
	baseUrl: string
): Promise<ImmichUploadResponse> {
	// Ensure we have a valid URL ending. API usually lives at /api
	// But users might provide the dashboard URL. We'll try to guess.
	// Standard Immich upload endpoint: POST /api/assets

	// Normalize base URL to remove trailing slash
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const uploadUrl = `${cleanBaseUrl}/api/assets`;

	const formData = new FormData();

	const filename = imageUri.split('/').pop() || `upload_${Date.now()}.jpg`;

	// Create the file object. React Native needs { uri, name, type }
	const file = {
		uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
		name: filename,
		type: 'image/jpeg', // Assuming JPEG from camera
	} as any;

	formData.append('assetData', file);
	formData.append('deviceAssetId', `${filename}-${Date.now()}`);
	formData.append('deviceId', 'react-native-app');
	formData.append('fileCreatedAt', new Date().toISOString());
	formData.append('fileModifiedAt', new Date().toISOString());
	formData.append('mediaCreatedAt', new Date().toISOString());

	console.log(`[Immich] Uploading to ${uploadUrl}...`);
	console.log(`[Immich] API Key: ${apiKey.substring(0, 10)}...`);
	console.log(`[Immich] File URI: ${file.uri}`);
	console.log(`[Immich] File name: ${file.name}`);

	try {
		const response = await axios.post(uploadUrl, formData, {
			headers: {
				'x-api-key': apiKey,
				'Content-Type': 'multipart/form-data',
				'Accept': 'application/json',
			},
			transformRequest: (data, headers) => {
				return data; // Prevent axios from transforming FormData
			},
			timeout: 30000, // 30 second timeout
		});

		console.log('[Immich] Upload success:', response.data);
		return response.data;
	} catch (error: any) {
		console.error('[Immich] Upload failed - Full error:', error);
		console.error('[Immich] Error message:', error.message);
		console.error('[Immich] Error code:', error.code);
		console.error('[Immich] Response status:', error.response?.status);
		console.error('[Immich] Response data:', error.response?.data);
		console.error('[Immich] Request config:', {
			url: error.config?.url,
			method: error.config?.method,
			headers: error.config?.headers,
		});

		// Provide more specific error messages
		if (error.code === 'ECONNREFUSED') {
			throw new Error('Cannot connect to Immich server. Is it running?');
		}
		if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
			throw new Error('Connection to Immich server timed out');
		}
		if (error.message === 'Network Error') {
			throw new Error('Network error - check if Immich URL is correct and server is accessible');
		}

		throw new Error(
			error.response?.data?.message || error.message || 'Failed to upload to Immich'
		);
	}
}
