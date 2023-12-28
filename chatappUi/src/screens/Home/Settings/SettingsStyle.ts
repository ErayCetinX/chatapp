import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  CardContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  CardIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CardType: {
    flexDirection: 'column',
    flex: 1,
  },
  CardTypeName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  CardTypeDescription: {
    color: '#121212',
    fontSize: 13,
    fontWeight: '400',
    paddingRight: 10,
  },
});

export default style;
