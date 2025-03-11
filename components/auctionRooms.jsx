import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import image from './corn.jpg';
const {width, height} = Dimensions.get('window');

const AuctionRooms = ({navigation, route}) => {
  const auctionData = route.params.auction; // JSON data passed from Roomlist
  console.log('inga ' + auctionData);
  const [bid, setBid] = useState(auctionData.starting_bid);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [alert, setAlert] = useState(false);
  const [minutes, setMinutes] = useState(5); // Changed to 5 minutes
  const [seconds, setSeconds] = useState(0);
  const [timerAnimation] = useState(new Animated.Value(1));
  const [highestBidder, setHighestBidder] = useState(
    auctionData.top_bidder || 'None',
  );
  const [stompClient, setStompClient] = useState(null);
  const auctionId = auctionData.auctionId;

  const bidAmounts = [
    Math.round(bid * 0.02),
    Math.round(bid * 0.05),
    Math.round(bid * 0.1),
  ];

  useEffect(() => {
    let intervalId;

    const receiveBid = async () => {
      try {
        const response = await axios.get(`http://192.168.23.154:1102/poll`);
        if (response.data) {
          const {bidAmount, bidderName} = response.data;
          setBid(bidAmount);
          setHighestBidder(bidderName);
          setMinutes(1);
          setSeconds(30);
        }
      } catch (e) {
        console.log(e);
      }
    };

    intervalId = setInterval(receiveBid, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const sendBid = async () => {
    try {
      const bidData = {
        bidderName: 'Ravi Kumar', // Replace with actual user name
        bidAmount: selectedBid,
      };

      const response = await axios.post(
        `http://192.168.23.154:1102/send`,
        bidData,
      );

      setBid(selectedBid);
      setHighestBidder('Current User');

      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Timer logic
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(timerAnimation, {
          toValue: 1.1,
          duration: 500,
          easing: Easing.easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(timerAnimation, {
          toValue: 1,
          duration: 500,
          easing: Easing.easeInOut,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    let timerInterval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0) return prevSeconds - 1;
        if (minutes === 0) {
          clearInterval(timerInterval);
          setAlert(true);
          return 0;
        }
        setMinutes(prevMinutes => prevMinutes - 1);
        return 59;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      timerAnimation.stopAnimation();
    };
  }, [minutes, seconds]);

  const placeBid = amount => {
    setSelectedBid(amount);
    setModalVisible(true);
  };

  const confirmBid = () => {
    sendBid();
    setBid(selectedBid);
    setMinutes(1);
    setSeconds(30);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Timer Component */}
        <Animated.View
          style={[styles.timeComp, {transform: [{scale: timerAnimation}]}]}>
          <Text style={styles.timerText}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Text>
        </Animated.View>

        {/* Auction Item Details */}
        <View style={styles.content}>
          <View style={styles.item}>
            <View style={styles.itemImage}>
              <Image
                source={image} // Fallback image
                style={styles.image}
                defaultSource={require('./doctor.png')} // Add fallback
              />
            </View>
            <View style={styles.itemName}>
              <Text style={styles.text}>{auctionData.auction_name}</Text>
              <Text style={styles.properties}>
                {auctionData.description || 'Properties of commodity'}
              </Text>
              <Text style={styles.location}>
                {/* <Icon name="location-on" size={16} color="#666" /> */}
                {auctionData.farmer.location}
              </Text>
            </View>
          </View>

          {/* Price Display */}
          <View style={styles.priceDisplay}>
            <Text style={styles.priceText}>
              Starting Bid: ₹{auctionData.starting_bid}
            </Text>
            <Text style={styles.priceText}>Current Bid: ₹{bid}</Text>
            <Text style={styles.priceText}>
              Quantity: {auctionData.quantity_available} kg
            </Text>
            <Text style={styles.priceText}>
              Highest Bidder: {highestBidder}
            </Text>
          </View>

          {/* Bid Options */}
          <View style={styles.bidOptions}>
            {bidAmounts.map((increment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bidButton}
                onPress={() => placeBid(bid + increment)}>
                <Text style={styles.bidButtonText}>Bid +₹{increment}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bid Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Bid</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to place a bid of ₹{selectedBid}?
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmBid}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Auction Ended Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={alert}
          onRequestClose={() => setAlert(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Auction has ended</Text>
              <Text style={styles.modalMessage}>
                {highestBidder} made the highest bid of ₹{bid}.
              </Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.confirmButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default AuctionRooms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  timeComp: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingVertical: 20,
    marginBottom: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemImage: {
    width: '40%',
    height: 150,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemName: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  properties: {
    color: '#555',
    fontSize: 16,
  },
  location: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceDisplay: {
    width: '100%',
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  priceText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  bidOptions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bidButton: {
    backgroundColor: '#388e3c',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    minWidth: '45%',
  },
  bidButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 20,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#2196f3',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#757575',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
