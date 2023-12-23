import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  box: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginVertical: 4,
    alignItems:'center',
  },
  messageWelcome: {
    marginTop: 4,
  },
  content: {
    padding: 12,
    width: '80%',
  },
  inputBox: {
    paddingHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 9,
    alignItems:'center',
    flexDirection:'row',
  },
  input: {
    padding: 12,
    width:'100%',
    fontSize: 16,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 99,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  info: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {

  },
  loginText: {
    color:'#007bff',
  },
  errorContainer:{
    backgroundColor: '#dc3545',
    width:'70%',
    height: 100,
    borderRadius: 12,
    marginTop: 6,
  },
  errorBox: {
    justifyContent: 'center',
    alignContent:'center',
    height:'100%',
    width:'100%',
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 15,
    textAlign:'center',
    color:'#fff',
    fontWeight:'600',
  },
});

export default style;

