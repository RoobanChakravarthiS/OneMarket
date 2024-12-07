import React, {useState, useEffect,useRef} from 'react';
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
import { io } from 'socket.io-client';
const StartAuction = ({
    username,
    userId,
    
    
}) => {
    const [auctionName, setAuctionName] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [itemImage, setItemImage] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [properties, setProperties] = useState('');
    const [auctionStarted, setAuctionStarted] = useState(true);
    const [highestBid, setHighestBid] = useState(null);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [showImageConfirmation, setShowImageConfirmation] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState(null);
    const [confirm, setConfirm] = useState(false);
    // const username = route.params.username;
    // const userId = route.params.userId;
    // const data = route.params.item;
    const [open,setopen] = useState(true);
    const [end,setend] = useState(false);
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
      const joinRoomRef = useRef(null)
    const timeResetterRef = useRef(null)
    const amountRef = useRef(1000)
    const [count,setCount] = useState(0)
    const [amount,getAmount] = useState(1000)
    const [timer,getTimer] = useState(0)
    const endAuction = () => {
      setIsAuctionEnded(true);
      setAuctionStarted(false);
      // Alert.alert('Auction Ended', `The auction has ended. The highest bid was ₹${highestBid}.`);
    };
    // useEffect(() => {
    //     const socket = io('http://192.168.17.154:1703')
    //     socket.on('connect', () => {

    //         socket.emit('joinroom',"hello")

    //         joinRoomRef.current = (room) => {
    //         }

    //         // socket.on('receive-bid',(e) => {
    //         //     console.log(e)
    //         //     amountRef.current = e
    //         //     getAmount(e)
    //         // })

    //         socket.emit('usercount','hello')

    //         // socket.on('receive-usercount',(e) =>{
    //         //     setCount(e)
    //         //     console.log(e)
    //         // })

    //         timeResetterRef.current = (e) => {
    //             socket.emit('reset timer')
    //             socket.emit('bidding',"user_id","user_name",(amountRef.current + amountRef.current * e/100))
    //         }

    //         // socket.on('timer update',(e) => {
    //         //     getTimer(e)
    //         // })

    //         return( () => socket.disconnect())
            
    //     },[])
    // })
    // // console.log(count)
    // const chatIdJoin = (chat) => {
    //     if(joinRoomRef.current) {
    //       joinRoomRef.current(chat)
    //     }
    //   }
  //   const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  //   const [minutes, setMinutes] = useState(5);
  //   const [seconds, setSeconds] = useState(0);
  // //   const endAuction = () => {
  //     setIsAuctionEnded(true);
  //     // setAuctionStarted(false);
  //     // Alert.alert('Auction Ended', `The auction has ended. The highest bid was ₹${highestBid}.`);
  //   };
  return (
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
    </View>
  );
};

export default StartAuction;

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
