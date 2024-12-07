import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';

const Negotiation = ({ route, navigation }) => {
  const { vendor } = route.params; // Get vendor details from navigation params
  const [message, setMessage] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [customOffer, setCustomOffer] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // Ensure vendor.price is a number
  const vendorPrice = parseFloat(vendor.price) || 0;

  const handleRateSelection = (percentage) => {
    if (selectedRate === percentage) {
      // Unselect the rate if it's already selected
      setSelectedRate(null);
      setMessage('');
    } else {
      const offerAmount = vendorPrice * (1 - percentage / 100);
      setMessage(`I would like to offer ₹${offerAmount.toFixed(2)} (₹${percentage}% off the original price).`);
      setSelectedRate(percentage);
    }
  };

  const handleCustomOfferChange = (text) => {
    setCustomOffer(text);
    if (text.trim().length > 0) {
      setMessage(`I would like to offer ₹{parseFloat(text).toFixed(2)}.`);
    } else {
      setMessage('');
    }
  };

  const handleSubmit = () => {
    if (message.trim().length === 0) {
      Alert.alert('Validation Error', 'Please enter your negotiation message or select a rate.');
      return;
    }
    
    // Show confirmation modal
    setModalVisible(true);
  };
  
  const confirmNegotiation = () => {
    // Handle the negotiation submission logic
    navigation.navigate('PaymentDone')
    // console.log("Negotiation submitted:", message);

    // TODO: Add functionality to send this offer to the vendor or backend here

    setModalVisible(false);
    // navigation.goBack();
  };

  const cancelNegotiation = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Negotiate with {vendor.name}</Text>
        <Text style={styles.infoText}>Price: ₹{vendorPrice.toFixed(2)}</Text>
        <Text style={styles.infoText}>
          Rating: {vendor.negotiable ? 'Negotiable' : 'Fixed Price'}
        </Text>
        <Text style={styles.infoText}>
          Sales: {vendor.bulk ? 'BULK' : ''} {vendor.bulk && vendor.retail ? '/' : ''} {vendor.retail ? 'RETAIL' : ''}
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Enter your custom offer amount"
          value={customOffer}
          onChangeText={handleCustomOfferChange}
          keyboardType="numeric"
        />

        <View style={styles.rateButtonsContainer}>
          {[1, 2, 5, 10].map(rate => {
            const offerAmount = vendorPrice * (1 - rate / 100);
            return (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.rateButton,
                  { backgroundColor: selectedRate === rate ? '#009688' : '#E0E0E0' }
                ]}
                onPress={() => handleRateSelection(rate)}
              >
                <Text style={[
                  styles.rateButtonText,
                  { color: selectedRate === rate ? '#ffffff' : '#333333' }
                ]}>
                  ₹{offerAmount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Offer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
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
            <Text style={styles.modalTitle}>Confirm Negotiation</Text>
            <Text style={styles.modalMessage}>{message}</Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmNegotiation}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={cancelNegotiation}>
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
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 15,
    backgroundColor: '#f9f9f9',
    width: '100%',
    color:'#000000',
    fontSize: 16,
  },
  rateButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  rateButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#006400', // Teal color for the button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336', // Red color for the button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    backgroundColor: '#009688', // Teal color for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Negotiation;
