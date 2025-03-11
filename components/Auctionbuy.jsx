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


const COLORS = {
  primaryGreen: '#1A411D',
  lightGreen: '#F0F4F0',
  textDark: '#2D2D2D',
  textGray: '#5A5A5A',
  white: '#FFFFFF',
};

const FONTS = {
  title: 24,
  body: 16,
  button: 18,
};

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
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.listContent}
        numColumns={2}
      />
    </View>
  );
};

export default Auctionbuy;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: COLORS.lightGreen,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  displayCard: {
    backgroundColor: COLORS.white,
    width: '45%', // Adjusted for margin
    borderRadius: 20,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primaryGreen,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    margin: 8, // Added margin for spacing
    padding: 0, // Remove padding from card
  },
  image: {
    width: '100%', // Cover the width of the card
    height: 120,
    resizeMode: 'cover',
    marginBottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primaryGreen,
    textAlign: 'center',
    padding: 10,
  },
  });
  