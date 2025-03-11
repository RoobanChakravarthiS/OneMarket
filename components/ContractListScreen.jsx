import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContractListScreen = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const contracts = [{
    contractId: "CNT12345",
    mncId: "MNC001",
    mncName: "ABC AgroTech Ltd.",
    cropType: "Wheat",
    quantityRequired: 1000,
    unit: "kg",
    expectedPriceRange: { min: 25, max: 30 },
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
    status: "active",
  }]; // Add more contracts as needed

  const handleSubmitQuote = () => {
    const price = parseFloat(quotePrice);
    if (!price || price < selectedContract.expectedPriceRange.min || price > selectedContract.expectedPriceRange.max) {
      setError(`Price must be between ₹${selectedContract.expectedPriceRange.min} - ₹${selectedContract.expectedPriceRange.max}`);
      return;
    }
    // Handle quote submission
    console.log('Submitted price:', price);
    setShowModal(false);
    setQuotePrice('');
    setError('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedContract(item);
        setShowModal(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.mncName}>{item.mncName}</Text>
        
        <View style={styles.infoRow}>
          <Icon name="grass" size={18} color="#4CAF50" />
          <Text style={styles.infoText}>{item.cropType}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="scale" size={18} color="#2196F3" />
          <Text style={styles.infoText}>{item.quantityRequired} {item.unit}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceRange}>
            ₹{item.expectedPriceRange.min} - ₹{item.expectedPriceRange.max}
          </Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'active' ? '#4CAF50' : '#9E9E9E' 
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contracts}
        renderItem={renderItem}
        keyExtractor={item => item.contractId}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Quote</Text>
            
            <Text style={styles.cropName}>{selectedContract?.cropType}</Text>
            <Text style={styles.quantityText}>
              {selectedContract?.quantityRequired} {selectedContract?.unit}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={`Enter price (₹${selectedContract?.expectedPriceRange.min} - ₹${selectedContract?.expectedPriceRange.max})`}
              keyboardType="numeric"
              value={quotePrice}
              onChangeText={text => {
                setQuotePrice(text);
                setError('');
              }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmitQuote}
              >
                <Text style={styles.buttonText}>Submit Quote</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  mncName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  cropName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  quantityText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#BDBDBD',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default ContractListScreen;