import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const HostAuction = ({navigation, route}) => {
  const [auctionName, setAuctionName] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [properties, setProperties] = useState('');
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [highestBid, setHighestBid] = useState(Number(startingBid)); // Initialize with starting bid
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [auctionId, setAuctionId] = useState(null);
  const [topBidder, setTopBidder] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const username = route.params.username;
  const userId = route.params.userId;
  const data = route.params.item;

  // Timer logic
  useEffect(() => {
    if (auctionStarted && (minutes > 0 || seconds > 0)) {
      const timerInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (minutes === 0 && seconds === 0) {
      endAuction();
    }
  }, [minutes, seconds, auctionStarted]);

  // WebSocket connection logic
  useEffect(() => {
    if (!auctionId) return; // Only connect if auctionId is available

    const socket = new SockJS('http://192.168.23.154:1102/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: str => console.log(str),
    });

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      setStompClient(client);

      // Subscribe to the auction topic
      client.subscribe(`/all/responses/${auctionId}`, message => {
        const bid = JSON.parse(message.body);
        console.log('Received bid:', bid);

        // Update the UI with the latest bid
        setHighestBid(bid.amount);
        setTopBidder(bid.bidder);
      });
    };

    client.onStompError = frame => {
      console.error('STOMP error:', frame.headers.message);
      Alert.alert(
        'Error',
        'Failed to connect to the auction. Please try again.',
      );
    };

    client.activate();

    // Cleanup on component unmount
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [auctionId]);

  // Function to place a bid
  const placeBid = () => {
    if (!stompClient || !bidAmount) {
      Alert.alert('Error', 'Please enter a valid bid amount.');
      return;
    }

    const bid = parseFloat(bidAmount);
    if (bid <= highestBid) {
      Alert.alert(
        'Error',
        'Your bid must be higher than the current highest bid.',
      );
      return;
    }

    // Send the bid to the server
    stompClient.publish({
      destination: `/app/join/${auctionId}`,
      body: JSON.stringify({amount: bid, bidder: username}),
    });

    // Clear the bid input
    setBidAmount('');
  };

  // Function to start the auction
  const startAuction = async () => {
    if (
      !auctionName ||
      !startingBid ||
      !quantity ||
      !description ||
      !properties
    ) {
      Alert.alert('Error', 'Please ensure all fields are filled.');
      return;
    }

    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        farmer: {id: userId},
        auction_name: auctionName,
        starting_bid: startingBid,
        quantity_available: quantity,
        description: description,
        properties: properties,
        top_bid: startingBid,
      }),
    );

    console.log(formData);

    if (itemImage) {
      const imageName = itemImage.split('/').pop();
      const imageType = `image/${imageName.split('.').pop()}`;
      formData.append('itemImage', {
        uri: itemImage,
        name: imageName,
        type: imageType,
      });
    }

    try {
      const response = await fetch(
        'http://192.168.23.154:1102/auctions/create',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        setAuctionId(responseData.auctionId);
        setAuctionStarted(true);
        setHighestBid(Number(startingBid)); // Initialize highest bid
        Alert.alert('Success', 'Auction hosted successfully!');
      } else {
        const errorText = await response.text();
        Alert.alert('Error', `Failed to host auction: ${errorText}`);
      }
    } catch (error) {
      console.error('API Error:', error.message);
      Alert.alert('Error', 'An error occurred while hosting the auction.');
    }
  };

  // Function to end the auction
  const endAuction = () => {
    setIsAuctionEnded(true);
    setAuctionStarted(false);
    if (stompClient) {
      stompClient.deactivate(); // Disconnect WebSocket
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setSelectedImageUri(response.assets[0].uri); // Set the selected image URI
        setShowImageConfirmation(true); // Show the confirmation modal
      }
    });
  };

  const confirmImageSelection = () => {
    setItemImage(selectedImageUri);
    setShowImageConfirmation(false); // Hide the confirmation modal
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!auctionStarted ? (
        <View style={styles.form}>
          <Text style={styles.headerText}>Host an Auction</Text>

          <TextInput
            style={styles.input}
            placeholder="Auction Name"
            value={auctionName}
            placeholderTextColor={'#000'}
            onChangeText={setAuctionName}
          />

          <TextInput
            style={styles.input}
            placeholder="Starting Bid (₹)"
            value={startingBid}
            onChangeText={setStartingBid}
            placeholderTextColor={'#000'}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity Available"
            value={quantity}
            onChangeText={setQuantity}
            placeholderTextColor={'#000'}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={'#000'}
            multiline
          />

          <TextInput
            style={styles.input}
            placeholder="Properties"
            value={properties}
            onChangeText={setProperties}
            placeholderTextColor={'#000'}
            multiline
          />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImagePicker}>
            <Text style={styles.imagePickerText}>Upload Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.startButton} onPress={startAuction}>
            <Text style={styles.startButtonText}>Start Auction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.auctionContainer}>
          <Text style={styles.auctionHeader}>{auctionName}</Text>

          <View style={styles.itemContainer}>
            {itemImage && (
              <Image source={{uri: itemImage}} style={styles.itemImage} />
            )}
            <Text style={styles.itemDescription}>{description}</Text>
            <Text style={styles.itemProperties}>{properties}</Text>
            <Text style={styles.itemStartingBid}>
              Starting Bid: ₹{startingBid}
            </Text>
            <Text style={styles.itemQuantity}>
              Quantity Available: {quantity}
            </Text>
            <Text style={styles.currentHighestBid}>
              Current Highest Bid: ₹{highestBid}
            </Text>

            {/* {renderProgressBar()} */}

            <Text style={styles.timerText}>
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.endAuctionButton}
            onPress={() => setConfirm(true)}>
            <Text style={styles.endAuctionButtonText}>End Auction</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        transparent={true}
        visible={isAuctionEnded}
        onRequestClose={() => setIsAuctionEnded(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Auction Ended</Text>
            <Text style={styles.modalMessage}>Highest Bid: ₹{highestBid}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsAuctionEnded(false);
                navigation.navigate('Auction');
              }}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showImageConfirmation}
        onRequestClose={() => setShowImageConfirmation(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Image Selection</Text>
            {selectedImageUri && (
              <Image
                source={{uri: selectedImageUri}}
                style={styles.modalImage}
              />
            )}
            <Text style={styles.modalMessage}>
              Do you want to use this image?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmImageSelection}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowImageConfirmation(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={confirm}
        onRequestClose={() => setConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Image Selection</Text>

            <Text style={styles.modalMessage}>
              Do you want to end this auction?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  endAuction();
                  setConfirm(false);
                }}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setConfirm(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  form: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f3f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  imagePicker: {
    backgroundColor: '#287344',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  auctionContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  auctionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  itemContainer: {
    width: '100%',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  itemDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemProperties: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemStartingBid: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemQuantity: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentHighestBid: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#e53935',
    fontWeight: 'bold',
    marginTop: 10,
  },
  endAuctionButton: {
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  endAuctionButtonText: {
    color: '#ffffff',
    fontSize: 18,
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
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#4caf50',
    marginBottom: 10,
  },
  activityIndicator: {
    width: '100%',
  },
});

export default HostAuction;
