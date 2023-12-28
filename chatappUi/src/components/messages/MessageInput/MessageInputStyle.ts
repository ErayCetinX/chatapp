import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  sendMessage: {
    margin: 4,
    alignItems: 'center',
  },
  Border: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 20,
  },
  pdgHe: {
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  Flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Icon: {
    justifyContent: 'center',
    marginRight: 10,
  },
  Button: {
    justifyContent: 'center',
  },
  ButtonColor: {
    fontWeight: '700',
    fontSize: 17,
  },
  Input: {
    marginRight: 5,
    minHeight: 0,
    minWidth: 0,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  TextInput: {
    fontSize: 17,
    maxHeight: 100,
    minHeight: 50,
  },
  ReplyContainer: {
    maxHeight: 100,
    width: '100%',
    borderRadius: 9,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default style;
