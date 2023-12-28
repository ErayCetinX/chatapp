import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  header: {
    width: '100%',
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  Inputs: {
    borderRadius: 20,
    flex: 1,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Input: {
    paddingHorizontal: 12,
    fontSize: 18,
  },
  DescContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
  Desc: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  SearchRes: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 16,
  },
  SearchResult: {
    borderColor: '#505050',
    borderWidth: 1,
    borderRadius: 3,
    left: '30%',
    marginLeft: -30,
    position: 'absolute',
    right: -12,
    top: 18,
    width: 300,
    zIndex: 9,
    marginTop: 40,
  },
  ResultContent: {
    padding: 16,
  },
  ResultFlex: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  UserContent: {
    paddingRight: 10,
    flex: 1,
    flexDirection: 'column',
  },
  User: {
    fontSize: 16,
    fontWeight: '600',
  },
  Fullname: {
    fontSize: 14,
    fontWeight: '400',
  },
  nsfw: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#04C484',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
});

export default style;
