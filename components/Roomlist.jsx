import {
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import list from './rooms.json'
const Roomlist = ({ navigation, route }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemd = route.params.item;
  // console.log(item)
  const username = route.params.username;
  const userId = route.params.userId;
  console.log(list[0])
  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = list
        console.log(response[itemd.id - 1])
        setRooms(response[itemd.id - 1].Details);
        setLoading(false);
        console.log(rooms);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.log(e);
      }
    };
    fetcher();
  }, []);

  const render = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('auctionRooms', {itemd,item})}
    >
      <View style={styles.cardContent}>
        <Text style={styles.roomId}>Room ID: {item.roomId}</Text>
        <Text style={styles.creatorName}>Creator: {item.creatorName}</Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            Current Bid: <Text style={styles.highlight}>{item.currentBid}</Text>
          </Text>
          <Text style={styles.detailText}>
            Base Price: <Text style={styles.highlight}>{item.basePrice}</Text>
          </Text>
          <Text style={styles.detailText}>
            Bidders: <Text style={styles.highlight}>{item.bidders}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require('./farmer.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>
      ) : (
        <FlatList
          renderItem={render}
          data={rooms}
          keyExtractor={(item) => item.roomId}
          contentContainerStyle={styles.listContent}
          numColumns={1}
        />
      )}
    </View>
  );
};

export default Roomlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0fdf4', // Soft, light green background color
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff', // White background for card contrast
    borderRadius: 16, // Rounded corners for a soft appearance
    padding: 20, // Generous padding for spacious feel
    marginBottom: 16, // Space between cards
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Larger offset for depth
    shadowOpacity: 0.3, // Softer shadow
    shadowRadius: 15, // Larger radius for a more subtle shadow
    elevation: 12, // Elevation for Android
    borderLeftWidth: 8, // Accent line on the left
    borderLeftColor: '#4B9F4C', // Fresh green accent color
    overflow: 'hidden', // Ensures rounded corners work correctly
     // White background for card content
    marginHorizontal: 10, // Margin on horizontal axis
    transform: [{ scale: 0.98 }], // Slightly scale down for a pressed effect
    transition: 'transform 0.3s ease', // Smooth transition effect
  },
  cardContent: {
    backgroundColor: '#f9f9f9', // Light background for card content
    borderRadius: 16, // Rounded corners inside card
    padding: 16, // Padding inside the card
  },
  roomId: {
    fontSize: 24, // Larger font size for title
    fontWeight: '700', // Bold weight for emphasis
    color: '#2a9d8f', // Teal color for title
    marginBottom: 8,
    fontFamily: 'Poppins', // Elegant Google font
  },
  creatorName: {
    fontSize: 18, // Slightly larger font size
    color: '#555',
    fontFamily: 'Poppins', // Consistent font
  },
  details: {
    marginTop: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Poppins', // Consistent font
  },
  highlight: {
    color: '#4B9F4C', // Fresh green for highlights
    fontWeight: '600',
    fontFamily: 'Poppins', // Consistent font
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4', // Consistent background color
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
    backgroundColor: '#f0fdf4', // Consistent background color
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c', // Red for error messages
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
