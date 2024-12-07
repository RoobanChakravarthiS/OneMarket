import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import pics from './pics';

const Auctionbuy = ({navigation,route}) => {
  const userId = route.params.userId;
  const username = route.params.username;
  // console.log('hi')
  const data = [
    {id: 1, name: 'Tomato'},
    {id: 2, name: 'Potato'},
    {id: 3, name: 'Carrot'},
    {id: 4, name: 'Cabbage'},
    {id: 5, name: 'Lettuce'},
    {id: 6, name: 'Broccoli'},
    {id: 7, name: 'Spinach'},
    {id: 8, name: 'Onion'},
    {id: 9, name: 'Pepper'},
    {id: 10, name: 'Corn'},
  ];
  const handlePress=(item)=>{
    navigation.navigate('room',{item,userId,username})
  }
  const render = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.displayCard}
        onPress={() => handlePress(item)} 
      >
        <Image source={pics[item.id]} style={styles.image} />
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={render}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        // numColumns={2}
      />
    </View>
  );
};

export default Auctionbuy;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0fdf4',
      padding: 15,
      width: '100%',
      
    },
    listContent: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      paddingTop:15,
      gap:15
    },
    displayCard: {
      backgroundColor: '#ffffff',
      width: '100%',
      height: '15%',
      borderRadius: 15,
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    //   padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      
    },
    image: {
      width: 140,
      borderRadius:15,
      height: 90,
      resizeMode: 'cover',
    //   marginBottom: 15,
    },
    text: {
      fontSize: 22,

      fontWeight: 'bold',
      color: '#00796b',
      marginTop: 15,
      marginBottom: 26,

    },
  });
  