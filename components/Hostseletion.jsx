import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import pics from './pics'; // Ensure your images are correctly imported from addphotos.js

const Hostselection = ({ navigation,route }) => {
  const userId = route.params.userId;
  const username = route.params.username;
  
  const data = [
    { id: 1, name: 'Tomato' },
    { id: 2, name: 'Potato' },
    { id: 3, name: 'Carrot' },
    { id: 4, name: 'Cabbage' },
    { id: 5, name: 'Lettuce' },
    { id: 6, name: 'Broccoli' },
    { id: 7, name: 'Spinach' },
    { id: 8, name: 'Onion' },
    { id: 9, name: 'Pepper' },
    { id: 10, name: 'Corn' },
  ];

  const handlePress = (item) => {
    navigation.navigate('hosting',  {item,userId,username} );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.displayCard}
      onPress={() => handlePress(item)} // Correctly pass the item to handlePress
    >
      <Image source={pics[item.id]} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

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
    paddingTop:5,
    flexWrap: 'wrap',
    width: '100%',
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
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: 100,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b',
  },
});

export default Hostselection;
