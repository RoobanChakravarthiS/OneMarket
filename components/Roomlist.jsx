import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';

const Roomlist = ({navigation, route}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = route.params.username;
  const userId = route.params.userId;

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const {data} = await axios.get(
          'http://192.168.23.154:1102/auctions/all',
        );
        console.log(data[0]); // Ensure this logs a valid object
        setRooms(data); // Store the actual data
      } catch (e) {
        setError(e);
        console.error('Error fetching auctions:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('auctionRooms', {auction: item})}>
      <View style={styles.cardContent}>
        <Text style={styles.auctionName}>{item.auction_name}</Text>
        <Text style={styles.farmerName}>
          Farmer: {item.farmer.firstname} {item.farmer.lastname}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            Current Bid: <Text style={styles.highlight}>₹{item.top_bid}</Text>
          </Text>
          <Text style={styles.detailText}>
            Starting Price:{' '}
            <Text style={styles.highlight}>₹{item.starting_bid}</Text>
          </Text>
          <Text style={styles.detailText}>
            Quantity:{' '}
            <Text style={styles.highlight}>{item.quantity_available} kg</Text>
          </Text>
          <Text style={styles.detailText}>
            Location:{' '}
            <Text style={styles.highlight}>{item.farmer.location}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('./farmer.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching auctions. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Auctions</Text>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={item => item.auctionId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0fdf4', // Soft, light green background
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2a9d8f', // Teal color for header
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 12,
    borderLeftWidth: 8,
    borderLeftColor: '#4B9F4C', // Fresh green accent
    overflow: 'hidden',
  },
  cardContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  auctionName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a9d8f', // Teal color for auction name
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  farmerName: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  details: {
    marginTop: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  highlight: {
    color: '#4B9F4C', // Fresh green for highlights
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  animation: {
    width: 200,
    height: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c', // Red for error messages
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Roomlist;
