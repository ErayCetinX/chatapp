import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column-reverse',
  },
  pdg: {
    width: '100%',
  },
  Barr: {
    display: 'flex',
    width: '100%',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ActiveuserItem: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    padding: 0,
    margin: 0,
  },
  MessageContent: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
    alignItems: 'center',
    paddingVertical: 4,
    color: '#fff',
  },
  Image: {
    marginRight: 5,
  },
  UserName: {
    marginBottom: 10,
  },
  UserNameText: {
    fontSize: 17,
    fontWeight: '700',
  },
  ActiveuserImage: {
    marginLeft: 5,
  },
  ActiveuserContainer: {
    flexDirection: 'row-reverse',
  },
  ActiveMessageContent: {
    flexDirection: 'column',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    marginHorizontal: 5,
  },
  GuestMessageContent: {
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'column',
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 5,
  },
  GuestuserUserName: {
    paddingBottom: 5,
    width: '100%',
    fontWeight: '700',
  },
  ActiveUserNameText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'aria',
    marginBottom: 5,
  },
  GuestUserNameText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'aria',
    marginBottom: 5,
    color: '#fff',
  },
  ActiveMessage: {
    maxWidth: 230,
    minWidth: 0,
  },
  GuestMessage: {
    maxWidth: 230,
    minWidth: 0,
    paddingTop: 4,
  },
  GuestContainer: {
    flexDirection: 'row',
  },
});

export default style;
