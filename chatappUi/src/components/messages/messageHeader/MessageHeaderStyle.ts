import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    maxHeight: 60,
    height: '100%',
    borderBottomWidth: 1,
    zIndex: 1,
    flexWrap: 'wrap',
  },
  pdg: {
    paddingLeft: 8,
    paddingRight: 8,
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  content: {
    alignItems: 'center',
    height: '100%',
    flexDirection: 'row',
    width: '100%',
  },
  Left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  User: {
    width: '100%',
    justifyContent: 'flex-start',
    minWidth: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserImage: {
    marginLeft: 15,
    justifyContent: 'center',
    alignContent: 'flex-start',
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: '#808080',
    alignItems: 'center',
  },
  UserName: {
    marginLeft: 12,
    justifyContent: 'center',
    minWidth: 0,
  },
  UserNameText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  Right: {
    marginLeft: 'auto',
    justifyContent: 'center',
  },
});

export default style;
