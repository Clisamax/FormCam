// src/utils/image.ts
import * as ImageManipulator from 'expo-image-manipulator';

// Resize the image to the target width while maintaining aspect ratio, and compress it to the target quality.
export async function resizeImage(uri: string) {
	const resized = await ImageManipulator.manipulateAsync(
		uri,
		[{ resize: { width: 640 } }], // Only specify width to maintain aspect ratio
		{ compress: 0.6 }
	);

	return resized;
}
