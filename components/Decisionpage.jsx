import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import pics from './pics'; // Ensure your images are correctly imported
import {BlurView} from 'expo-blur'; // Install expo-blur if you want blur effect
import axios from 'axios';

// Constants for styling
const COLORS = {
  primaryGreen: '#1A411D',
  lightGreen: '#C8DECD',
  textDark: '#2D2D2D',
  textGray: '#5A5A5A',
  white: '#FFFFFF',
};

const FONTS = {
  title: 24,
  body: 16,
  button: 18,
};

const Decisionpage = ({navigation, route}) => {
  const responseData = route.params.responseData;
  const userId = responseData.id;
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    {
      id: 1,
      name: 'Tomato',
      reason: 'High demand and suitable weather conditions.',
      supply: 'Low',
      soilCondition: 'Well-drained loamy soil',
      weather: 'Warm climate with moderate rainfall',
    },
    {
      id: 2,
      name: 'Potato',
      reason: 'Profitable due to consistent market demand.',
      supply: 'Medium',
      soilCondition: 'Sandy loam soil',
      weather: 'Cool climate with consistent moisture',
    },
    {
      id: 3,
      name: 'Carrot',
      reason: 'Ideal for regions with good irrigation facilities.',
      supply: 'High',
      soilCondition: 'Deep sandy soil',
      weather: 'Cool to moderate climate',
    },
    {
      id: 4,
      name: 'Cabbage',
      reason: 'Can be grown in various climates and has stable prices.',
      supply: 'Medium',
      soilCondition: 'Well-drained clayey soil',
      weather: 'Mild temperatures with moderate humidity',
    },
    {
      id: 5,
      name: 'Lettuce',
      reason: 'Short harvesting period and good market value.',
      supply: 'Low',
      soilCondition: 'Moist, well-drained sandy loam',
      weather: 'Cool temperatures with light sunlight',
    },
    {
      id: 6,
      name: 'Broccoli',
      reason: 'Growing demand for organic and healthy food options.',
      supply: 'Medium',
      soilCondition: 'Rich, fertile loamy soil',
      weather: 'Cool and humid conditions',
    },
    {
      id: 7,
      name: 'Spinach',
      reason: 'High nutrition value and low maintenance cost.',
      supply: 'High',
      soilCondition: 'Fertile, well-drained sandy loam',
      weather: 'Mild climate with partial shade',
    },
    {
      id: 8,
      name: 'Onion',
      reason: 'Essential commodity with stable pricing trends.',
      supply: 'Medium',
      soilCondition: 'Loamy soil with good drainage',
      weather: 'Hot and dry conditions',
    },
    {
      id: 9,
      name: 'Pepper',
      reason: 'Premium pricing due to seasonal demand fluctuations.',
      supply: 'Low',
      soilCondition: 'Well-drained sandy soil',
      weather: 'Warm climate with high humidity',
    },
    {
      id: 10,
      name: 'Corn',
      reason: 'Large-scale cultivation with high yield potential.',
      supply: 'Medium',
      soilCondition: 'Fertile, well-aerated loamy soil',
      weather: 'Warm temperatures with adequate rainfall',
    },
  ];

  const suggestBestCrop = () => {
    const bestCrop = data.find(crop => crop.supply === 'Low');

    return bestCrop || data[0];
  };

  useEffect(() => {
    const bestCrop = suggestBestCrop();
    setSelectedCrop(bestCrop);
    setModalVisible(true);
    suggester();
  }, []);

  const suggester = async () => {
    try {
      const response = await axios.post(
        `https://f71d-43-250-42-50.ngrok-free.app/predict`,
        {
          N: 90,
          P: 42,
          K: 43,
          temperature: 20.879744,
          humidity: 82.002744,
          ph: 6.502985,
          rainfall: 202.935536,
        },
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmSelection = async () => {
    setModalVisible(false);
    console.log(selectedCrop + ' navigate');
    try {
      const newCrop = {
        id: selectedCrop.id, // Generate a unique ID if needed
        name: selectedCrop.name,
        current_stage: 'Seedling',
        progress: 0.0,
        tasks: null,
        planner: null,
        farmer: {id: userId},
      };

      const response = await axios.post(
        `http://192.168.23.154:1102/farmer/${responseData.id}/crops`,
        newCrop,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const responseData = response.data;
        console.log('Crop added successfully:', responseData);
        navigation.navigate('Main', {newCrop, responseData});
      } else {
        console.log('Unexpected response:', response);
      }
    } catch (error) {
      console.error(
        'Error adding crop:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  const handlePress = item => {
    setSelectedCrop(item);
    // console.log(selectedCrop)
    setModalVisible(true);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.displayCard}
      onPress={() => handlePress(item)}>
      <Image source={pics[item.id]} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        // Add space between columns
        numColumns={2}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          {/* Optional Blur Effect */}
          {/* <BlurView intensity={20} style={StyleSheet.absoluteFill} /> */}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Best Crop Suggestion</Text>
            {selectedCrop && (
              <>
                <Text style={styles.modalText}>
                  {selectedCrop.name} is the best choice for you!
                </Text>
                <Text style={styles.modalReason}>
                  Reason: {selectedCrop.reason}
                </Text>
                <Text style={styles.modalDetail}>
                  Supply in Surrounding Area: {selectedCrop.supply}
                </Text>
                <Text style={styles.modalDetail}>
                  Soil Condition: {selectedCrop.soilCondition}
                </Text>
                <Text style={styles.modalDetail}>
                  Weather Requirement: {selectedCrop.weather}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmSelection}>
              <Text style={styles.buttonText}>Select This Crop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24, // Added padding
  },
  modalTitle: {
    fontSize: FONTS.title,
    fontWeight: '700',
    color: COLORS.primaryGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalReason: {
    fontSize: FONTS.body,
    color: COLORS.textGray,
    marginBottom: 20,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  modalDetail: {
    fontSize: FONTS.body,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.button,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Decisionpage;
