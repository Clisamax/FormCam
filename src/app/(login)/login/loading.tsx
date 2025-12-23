import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from "expo-router";

import { styles } from '@/styles/login/stylesLoading';


const LoadingScreen = () => {
	const navigation = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.push('/(auth)/forms/home/home'); 
		}, 2000);

		return () => clearTimeout(timer);
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Image source={require('@/assets/MaxCam.png')} style={styles.image} />
		</View>
	);
};



export default LoadingScreen;
