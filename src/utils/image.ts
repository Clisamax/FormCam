// src/utils/image.ts
import * as ImageManipulator from 'expo-image-manipulator';

// Resize the image to the target width and height, and compress it to the target quality.
export async function resizeImage(uri: string) {
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024, height: 1024 } }],
    { compress: 0.8 }
  );

  return resized;
}
