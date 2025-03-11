import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  PermissionsAndroid, // Import for Android permissions
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Geolocation from 'react-native-geolocation-service'; // Import the geolocation service

const AddRental = () => {
  const [rentalData, setRentalData] = useState({
    image: null,
    title: '',
    rate: '',
    contact: '',
    description: '',
    rating: '',
    location: '',
  });

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to access your location',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You have granted location permission.');
            getCurrentLocation();
          } else {
            console.log('Location permission denied');
            setErrorMsg('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation(); // iOS doesn't need explicit permission here
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setRentalData(prev => ({
            ...prev,
            location: `${position.coords.latitude}, ${position.coords.longitude}`,
          }));
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
          setErrorMsg(error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocationPermission();
  }, []);

  // Function to handle image selection
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        setRentalData({ ...rentalData, image: response.assets[0].uri });
      }
    });
  };

  // Function to handle form submission
  const handleSubmit = () => {
    console.log('Rental Data:', rentalData);
    // Handle form submission (Send data to backend)
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        {/* Image Upload */}
        <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
          {rentalData.image ? (
            <Image source={{ uri: rentalData.image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholderContainer}>
              <Icon name="camera" size={30} color="#708090" />
              <Text style={styles.imagePlaceholderText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.inputContainer}>
          <Icon name="header" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rental Title"
            value={rentalData.title}
            onChangeText={(text) => setRentalData({ ...rentalData, title: text })}
            placeholderTextColor="#708090"
          />
        </View>

        {/* Rate Per Hour */}
        <View style={styles.inputContainer}>
          <Icon name="money" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rate per Hour ($)"
            keyboardType="numeric"
            value={rentalData.rate}
            onChangeText={(text) => setRentalData({ ...rentalData, rate: text })}
            placeholderTextColor="#708090"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            keyboardType="phone-pad"
            value={rentalData.contact}
            onChangeText={(text) => setRentalData({ ...rentalData, contact: text })}
            placeholderTextColor="#708090"
          />
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Icon name="file-text-o" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={rentalData.description}
            onChangeText={(text) => setRentalData({ ...rentalData, description: text })}
            placeholderTextColor="#708090"
          />
        </View>

        {/* Rating */}
        <View style={styles.inputContainer}>
          <Icon name="star" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            keyboardType="numeric"
            value={rentalData.rating}
            onChangeText={(text) => setRentalData({ ...rentalData, rating: text })}
            placeholderTextColor="#708090"
          />
        </View>

        {/* Location */}
        <View style={styles.inputContainer}>
          <Icon name="map-marker" size={20} color="#708090" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={rentalData.location}
            onChangeText={(text) => setRentalData({ ...rentalData, location: text })}
            placeholderTextColor="#708090"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Rental</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddRental;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 5,
  },
  imageUpload: {
    backgroundColor: '#f0f0f0',
    height: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  imagePlaceholderContainer: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#708090',
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
