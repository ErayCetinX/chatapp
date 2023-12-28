import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    shadowOffset: {
      width: 0,
      height: 24,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 14,
    backgroundColor: '#FBFCFF',
    height: 60,
  },
  Box: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  ButtonBox: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
});

export default style;
