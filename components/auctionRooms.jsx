import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import pics from './pics';

const AuctionRooms = ({ navigation, route }) => {
  const [bid, setBid] = useState(5000); // Initial bid amount in rupees
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [alert ,setAlert] = useState(false);
  const data = route.params.item;
  const item = route.params.itemd;
  console.log(data);

  const placeBid = (amount) => {
    setSelectedBid(amount);
    setModalVisible(true);
  };

  const confirmBid = () => {
    setBid(selectedBid);
    setMinutes(1);
    setSeconds(30);
    setModalVisible(false);
  };

  const bidAmounts = [
    Math.round(bid * 0.02), 
    Math.round(bid * 0.05), 
    Math.round(bid * 0.1), 
  ];
  const [minutes, setMinutes] = useState(0); 
  const [seconds, setSeconds] = useState(10); 

  useEffect(() => {
    let timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timerInterval);
          setAlert(true)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [minutes, seconds]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Timer Component */}
      <View style={styles.timeComp}>
        <Text style={styles.timerText}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      </View>

      {/* Auction Item Details */}
      <View style={styles.content}>
        <View style={styles.item}>
          <View style={styles.itemImage}>
            <Image source={pics[item.id]} style={styles.image} />
          </View>
          <View style={styles.itemName}>
            <Text style={styles.text}>{data.name}</Text>
            <Text style={styles.properties} >proprties of commodity
            </Text>
          </View>
        </View>

        {/* Price Display */}
        <View style={styles.priceDisplay}>
          <View style={styles.startingBid}>
            <Text style={styles.priceText}>Starting Bid: ₹{data.startingBid}</Text>
          </View>
          <View style={styles.currentBid}>
            <View style={styles.bidAmount}>
              <Text style={styles.priceText}>Current Bid: ₹{bid}</Text>
            </View>
            <View style={styles.highestBidder}>
              <Text style={styles.priceText}>Highest Bidder: {data.highestBidder}</Text>
            </View>
          </View>
        </View>

        {/* Bid Options */}
        <View style={styles.bidOptions}>
          {bidAmounts.map((increment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bidButton}
              onPress={() => placeBid(bid + increment)}
            >
              <Text style={styles.bidButtonText}>Bid +₹{increment}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Bid</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to place a bid of ₹{selectedBid}?
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmBid}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* this is the  start of the alerting the auction ended modal */}


      <Modal
        animationType="slide"
        transparent={true}
        visible={alert}
        onRequestClose={() => setAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Auction has ended</Text>
            <Text style={styles.modalMessage}>
              this guy made the highest bid of  ₹{selectedBid}?
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              // onPress={confirmBid}
              onPress={()=>navigation.goBack()
              }
            >
              <Text style={styles.confirmButtonText}>Exit</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AuctionRooms;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  properties:{
    color:'#000000',
    fontSize:15,
  },
  timeComp: {
    backgroundColor: '#4caf50',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingVertical: 20,
    marginBottom: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  itemImage: {
    width: '40%',
    height: 120,
    marginRight: 20,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    resizeMode: 'cover',
  },
  itemName: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  priceDisplay: {
    width: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  priceText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bidOptions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 15,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  bidButton: {
    backgroundColor: '#287344',
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
  },
  bidButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 25,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
