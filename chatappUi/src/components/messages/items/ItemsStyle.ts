import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  Image: {
    width: 45,
    height: 45,
  },
  Images: {
   width: 55,
   height: 55,
    borderRadius: 20,
  },
  userContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Text: {
    flexDirection: 'column',
    marginHorizontal: 16,
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    color: '#A8ACC5',
  },
});

export default style;
