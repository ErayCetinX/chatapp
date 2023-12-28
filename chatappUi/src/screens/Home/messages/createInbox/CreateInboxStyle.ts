import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    padding: 12,
  },
  Header: {
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Icon: {
    marginRight: 20,
  },
  Input: {
    fontSize: 16,
  },
  content: {
    marginTop: 16,
  },
  Text: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  TextContent: {
    fontSize: 17,
    fontWeight: '400',
    // color: '#363636',
  },
  UserResult: {
    flexDirection: 'column',
    marginTop: 8,
    height: '100%',
  },
  UserResultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  Person: {
    marginRight: 20,
  },
  Top: {
    width: '100%',
    height: 80,
    padding: 12,
    flexDirection: 'row',
  },
  Search: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    flex: 1,
  },
  CreateText: {
    color: '#04C484',
    fontWeight: '700',
    fontSize: 16,
  },
  UserContent: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'column',
  },
  User: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-start',
    width: '100%',
  },
  UserImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  UserText: {
    fontWeight: '400',
    fontSize: 18,
  },
  UserInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  CheckBox: {
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  Create: {
    marginLeft: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default style;
