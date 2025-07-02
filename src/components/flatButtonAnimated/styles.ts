import { COLORS } from '@/styles/global/color';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menu: {
    backgroundColor: COLORS.red[500],
  },
  submenu: {
    position: 'absolute',
    backgroundColor: COLORS.gray[400],
  },
});

export default styles;
