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

const HostAuction = ({navigation, route}) => {
  const [auctionName, setAuctionName] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [properties, setProperties] = useState('');
  const [auctionStarted, setAuctionStarted] = useState(false);
  const [highestBid, setHighestBid] = useState(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [showImageConfirmation, setShowImageConfirmation] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const username = route.params.username;
  const userId = route.params.userId;
  const data = route.params.item;
  //   console.log(data);
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
    setAuctionStarted(true);
    const formData = new FormData();
    formData.append(
      'data',
      JSON.stringify({
        userid: userId,
        auction_name: auctionName,
        starting_bid: startingBid,
        quantity: quantity,
        description: description,
        properties: properties,
      }),
    );

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
      console.log('Sending formData:', formData); // Log FormData for debugging

      const response = await fetch(
        'http://192.168.220.154:1111/createauctionhouse',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.status === 201) {
        setIsAuctionEnded(false);
        // Alert.alert('Success', 'Auction hosted successfully!');
        navigate.goBack()
      } else {
        const errorText = await response.text();
        console.log('Response error:', errorText);
        Alert.alert('Error', `Failed to host auction: ${errorText}`);
      }
    } catch (error) {
      // console.error('API Error:', error.message);8
      // Alert.alert('Error', 'An error occurred while hosting the auction.');
    }
  };

  const endAuction = () => {
    setIsAuctionEnded(true);
    setAuctionStarted(false);
    // Alert.alert('Auction Ended', `The auction has ended. The highest bid was ₹${highestBid}.`);
  };

  // const renderProgressBar = () => {
  //   const starting = Number(startingBid);
  //   const highest = Number(highestBid);

  //   if (starting && highest && starting > 0) {
  //     const progress = Math.min((highest - starting) / starting, 1);
  //     return (
  //       <View style={styles.progressContainer}>
  //         <Text style={styles.progressText}>
  //           Progress: {Math.round(progress * 100)}%
  //         </Text>
  //         <ActivityIndicator
  //           size="large"
  //           color="#4caf50"
  //           style={styles.activityIndicator}
  //         />
  //       </View>
  //     );
  //   }
  //   return null;
  // };

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
