import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraView, FlashMode } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";

const CAMERA_PERMISSION_KEY = "@camera:permission";

/**
 * Hook para gerenciar a câmera com verificação e persistência de permissões.
 * Verifica automaticamente as permissões salvas e solicita novas permissões quando necessário.
 */
export function useCamera() {
	// Reference to the Camera component
	const cameraRef = useRef<CameraView | null>(null);

	// Permission state
	const [permission, setPermission] = useState<{ granted: boolean; canAskAgain: boolean } | null>(null);

	// Flash mode state
	const [flash, setFlash] = useState<FlashMode>("off");

	/**
	 * Carrega o status da permissão salva do AsyncStorage
	 */
	const loadSavedPermission = useCallback(async () => {
		try {
			const savedPermission = await AsyncStorage.getItem(CAMERA_PERMISSION_KEY);
			if (savedPermission) {
				const parsed = JSON.parse(savedPermission);
				setPermission(parsed);
			}
		} catch (error) {
			console.warn("Erro ao carregar permissão salva:", error);
		}
	}, []);

	/**
	 * Salva o status da permissão no AsyncStorage
	 */
	const savePermission = useCallback(async (perm: { granted: boolean; canAskAgain: boolean }) => {
		try {
			await AsyncStorage.setItem(CAMERA_PERMISSION_KEY, JSON.stringify(perm));
			setPermission(perm);
		} catch (error) {
			console.warn("Erro ao salvar permissão:", error);
		}
	}, []);

	/**
	 * Verifica o status atual da permissão da câmera
	 */
	const checkPermission = useCallback(async () => {
		try {
			const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();
			const perm = { granted: status === 'granted', canAskAgain };
			await savePermission(perm);
			return perm;
		} catch (error) {
			console.warn("Erro ao verificar permissão:", error);
			return { granted: false, canAskAgain: true };
		}
	}, [savePermission]);

	/**
	 * Solicita permissão da câmera ao usuário
	 */
	const requestPermission = useCallback(async () => {
		try {
			const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
			const perm = { granted: status === 'granted', canAskAgain };
			await savePermission(perm);
			return perm;
		} catch (error) {
			console.warn("Erro ao solicitar permissão:", error);
			const perm = { granted: false, canAskAgain: true };
			await savePermission(perm);
			return perm;
		}
	}, [savePermission]);

	/**
	 * Called when the camera is ready.
	 */
	const onCameraReady = useCallback(() => {
		// Camera is ready
	}, []);

	/**
	 * Ensure the camera is ready and permission granted before taking a picture.
	 */
	const ensureReady = useCallback(() => {
		if (!permission?.granted) {
			console.warn("Camera permission not granted.");
			return false;
		}
		if (!cameraRef.current) {
			console.warn("Camera ref is not set.");
			return false;
		}
		return true;
	}, [permission]);

	// Carrega a permissão salva quando o hook é inicializado
	useEffect(() => {
		loadSavedPermission();
	}, [loadSavedPermission]);

	return {
		cameraRef,
		permission,
		requestPermission,
		flash,
		setFlash,
		onCameraReady,
		ensureReady,
		checkPermission, // Exporta função para checar permissão manualmente se necessário
	};
}
