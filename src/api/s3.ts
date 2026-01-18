import { api } from '@/services/api';

/**
 * Request a presigned S3 URL for uploading a file.
 * This is a simple wrapper around the backend endpoint that returns
 * the presigned URL. Adjust the endpoint path as needed for your API.
 *
 * @param fileName Name of the file to be uploaded.
 * @param mimeType MIME type of the file (e.g., "image/jpeg").
 * @returns The presigned URL as a string.
 */
export async function fetchPresignedUrl(fileName: string, mimeType: string): Promise<string> {
  try {
    const response = await api.post<{ url: string }>('/presign', {
      fileName,
      mimeType,
    });
    return response.data.url;
  } catch (e) {
    console.error('Failed to fetch presigned URL', e);
    throw e;
  }
}
