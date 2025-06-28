export interface NetworkTestResult {
	isConnected: boolean;
	isInternetReachable: boolean;
	serverReachable: boolean;
	responseTime?: number;
	error?: string;
	deviceIP?: string;
	serverURL?: string;
} 