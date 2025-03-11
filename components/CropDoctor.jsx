'use client';

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios'; // Import axios for HTTP requests

const PlantDiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request camera permission (Android only)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Function to handle image selection from Camera or Gallery
  const handleImagePicker = async type => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    try {
      const result =
        type === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);
      if (result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  // Function to upload the image to backend for disease detection
  const uploadImage = async imageUri => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant_disease.jpg',
    });

    try {
      const response = await axios.post(
        'https://f71d-43-250-42-50.ngrok-free.app/predict-yolo',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      console.log('Response:', response.data);
      setAnalysisResult(response.data); // Store API response
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('./crop-doctor.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Plant Disease Detector</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              const granted = await requestCameraPermission();
              if (granted) handleImagePicker('camera');
            }}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePicker('gallery')}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <Image source={{uri: selectedImage}} style={styles.previewImage} />
        )}

        {loading && <ActivityIndicator size="large" color="#ff8400" />}

        {analysisResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultHeading}>Analysis Results:</Text>
            <Text style={styles.resultText}>
              Disease:{' '}
              {analysisResult?.predictions?.[0]?.class_name || 'Unknown'}
            </Text>
            <Text style={styles.resultText}>
              Fertilizer Suggestion:{' '}
              {analysisResult?.fertilizer_suggestions || 'No data'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#2b2e36',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#287344',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    marginTop: 20,
    elevation: 3,
  },
  resultHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b2e36',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});

export default PlantDiseaseDetection;
