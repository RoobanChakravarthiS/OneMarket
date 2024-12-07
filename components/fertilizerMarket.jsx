import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import fertiimages from './fertilizerimg'; // Assuming this contains your images
import LottieView from 'lottie-react-native';
const FertilizerMarket = ({route}) => {
  const [fertilizers, setFertilizers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [numColumns, setNumColumns] = useState(2);
  const userId = route.params;
  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.220.154:1111/getfertimart'); // Replace with your server's URL
        if (response.ok) {
          const data = await response.json();
          setFertilizers(data);
        } else {
          console.error('Failed to fetch data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View key={item.id} style={styles.displayCard}>
        <Image source={fertiimages[item.id]} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
          <LottieView
            source={require('./farmer.json')} // replace with your Lottie file path
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fertilizers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default FertilizerMarket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Light background color for the whole screen
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 400,
    height:400,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  displayCard: {
    backgroundColor: '#ffffff', // White background for each card
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '48%', // Ensure cards fit within columns
    justifyContent: 'space-between',
    borderColor: '#e0e0e0', // Light border color for card edges
    borderWidth: 1,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d40', // Dark green color
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#00796b', // Teal color
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#616161', // Dark gray color for description
    textAlign: 'center',
    marginHorizontal: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#004d40', // Dark green color for the button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});
