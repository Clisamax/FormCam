import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraUpload from '@/components/cameraUpload/indexCamera';


export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <CameraUpload />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
