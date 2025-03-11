import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const CropInvestmentForm = ({navigation, route}) => {
  const {username = 'Admin'} = route.params.username || {}; // Default username
  const [cropName, setCropName] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [numShares, setNumShares] = useState('');
  const [sharePrice, setSharePrice] = useState('');
  const [area, setArea] = useState('');
  const [expectedYield, setExpectedYield] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('Pending');
  const userId = route.params.userId;
  const handleSubmit = async () => {
    if (
      !cropName ||
      !totalPrice ||
      !numShares ||
      !sharePrice ||
      !area ||
      !expectedYield ||
      !contactNumber ||
      !address
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const investmentData = {
      creater: {id: userId}, // Ensure it's the correct farmer ID
      total_amount: parseFloat(totalPrice),
      total_split: parseFloat(totalPrice),
      no_of_shares: parseInt(numShares),
      shareholders: [],
      cost_of_share: parseFloat(sharePrice),
      address,
      expected_yeild: expectedYield, // Ensure it matches the backend field
      area,
      status: 'Pending', // If status is predefined
      farmer: {id: userId},
    };

    console.log('Sending Data:', investmentData);

    try {
      const response = await fetch('http://192.168.23.154:1102/shares/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investmentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit data: ${errorText}`);
      }

      const result = await response.json();
      console.log('Response:', result);
      Alert.alert('Success', 'Investment Created Successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create investment');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.card}>
          <Text style={styles.header}>Crop Investment Details</Text>

          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{username}</Text>

          <Text style={styles.label}>Crop Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter crop name"
            value={cropName}
            onChangeText={setCropName}
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Total Price Needed (₹):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter total price"
            value={totalPrice}
            onChangeText={setTotalPrice}
            keyboardType="numeric"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Number of Shares:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of shares"
            value={numShares}
            onChangeText={setNumShares}
            keyboardType="numeric"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Share Price (₹):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter share price"
            value={sharePrice}
            onChangeText={setSharePrice}
            keyboardType="numeric"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Area (in acres):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter area in acres"
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Expected Yield (in kg):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter expected yield"
            value={expectedYield}
            onChangeText={setExpectedYield}
            keyboardType="numeric"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Contact Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#777"
          />

          <Text style={styles.label}>Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#777"
          />
        </View>
        <Text style={styles.statusText}>Status: Pending</Text>
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  formContainer: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  value: {
    fontSize: 17,
    color: '#4CAF50',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    fontSize: 17,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  statusText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default CropInvestmentForm;
