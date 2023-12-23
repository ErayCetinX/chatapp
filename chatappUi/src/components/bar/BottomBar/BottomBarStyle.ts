import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    borderRadius: 15,
    backgroundColor: 'red',
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
