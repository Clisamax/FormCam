import React from 'react';
import { View, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/styles/global/color';

const CameraButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.circle}>
        <Ionicons name="camera" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.red[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.red[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraButton;
// there is a container outside the button that is making it dark, remove itc