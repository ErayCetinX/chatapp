import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginHorizontal: 16,
    justifyContent:'center',
    maxHeight: 65,
    height:'100%',
  },
  box: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  userInfo: {
    flexDirection:'row',
    alignItems:'center',
  },
  userImage: {
    marginRight: 8,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color:'#0E0E1C',
  },
  time: {
    fontSize:14,
    color:'#8F91AC',
  },
  Icons: {
    flexDirection:'row',
    alignItems:'center',
  },
  IconsItem: {
    marginHorizontal: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    color:'#000',
    justifyContent:'center',
  },
});

export default style;
