import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import pics from './pics';

const Filldetails = ({route, navigation}) => {
  const data = route.params;
  const [suggest, setSuggest] = useState(false);
  const [value, setValue] = useState(null);
  const commodity = data.item.name;
  const capCommodity = commodity.charAt(0).toUpperCase() + commodity.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://f71d-43-250-42-50.ngrok-free.app/search',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Commodity: capCommodity,
            }),
          },
        );

        // Check if the response status is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Convert the response to JSON
        const data = await response.json();
        console.log(data['Modal Price']); // Log the response data
        setValue(data['Modal Price']);
      } catch (err) {
        console.log(err.message); // Log any error messages
      } finally {
        setSuggest(true);
      }
    };
    fetchData(); // Call the async function
  }, [capCommodity]);

  const [details, setDetails] = useState({
    cropid: data?.item.id,
    bulk: false,
    retail: false,
    userid: data.userId,
    crop: data?.item.name || '', // Fallback in case data.name is undefined
    id: data?.item.id || '', // Fallback in case data.id is undefined
    price: '',
    quantity: '',
    negotiable: true,
    duration: '1 Week', // Setting an initial value for duration
  });

  const handlePress = type => {
    setDetails(prevDetails => ({
      ...prevDetails,
      [type]: !prevDetails[type],
    }));
  };

  const handleNegotiation = () => {
    setDetails(prevDetails => ({
      ...prevDetails,
      negotiable: !prevDetails.negotiable,
    }));
  };

  const handlesubmit = () => {
    if (details.price === '' || details.quantity === '') {
      alert('Please fill all fields.');
      return; // Exit early if validation fails
    }

    // Additional validation for numeric input
    if (isNaN(details.price) || isNaN(details.quantity)) {
      alert('Price and Quantity must be numeric');
      return;
    }

    const productData = {
      userid: details.userid,
      farmer: {id: details.userid},
      crop: details.crop,
      id: details.id,
      price: details.price,
      quantity: details.quantity,
      negotiable: details.negotiable,
      duration: details.duration,
      retail: details.retail,
      bulk: details.bulk,
    };

    console.log(productData);

    fetch(`http://192.168.23.154:1102/products/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData), // Send the updated product data
    })
      .then(response => {
        if (response.status === 200) {
          navigation.navigate('PaymentDone');
        } else {
          alert('Failed to add product');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.choice}>
          <Image style={styles.image} source={pics[data.item.id]} />
        </View>
        <View style={styles.details}>
          <Text style={styles.text}>Name: {data.username}</Text>
          <View style={styles.selectors}>
            <TouchableOpacity
              style={details.retail ? styles.selected : styles.unselected}
              onPress={() => handlePress('retail')}>
              <Text
                style={
                  details.retail ? styles.selectedButtonText : styles.buttonText
                }>
                RETAIL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={details.bulk ? styles.selected : styles.unselected}
              onPress={() => handlePress('bulk')}>
              <Text
                style={
                  details.bulk ? styles.selectedButtonText : styles.buttonText
                }>
                BULK
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            keyboardType="numeric"
            value={details.price}
            onChangeText={value => setDetails({...details, price: value})}
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Quantity"
            keyboardType="numeric"
            value={details.quantity}
            onChangeText={value => setDetails({...details, quantity: value})}
            placeholderTextColor="#888"
          />
        </View>
        <View>
          <Text style={styles.text}>Negotiable?</Text>
          <View style={styles.selectors}>
            <TouchableOpacity
              style={details.negotiable ? styles.unselected : styles.selected}
              onPress={handleNegotiation}>
              <Text
                style={
                  details.negotiable
                    ? styles.buttonText
                    : styles.selectedButtonText
                }>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={details.negotiable ? styles.selected : styles.unselected}
              onPress={handleNegotiation}>
              <Text
                style={
                  details.negotiable
                    ? styles.selectedButtonText
                    : styles.buttonText
                }>
                No
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select shelf Duration:</Text>
            <Picker
              selectedValue={details.duration}
              style={styles.picker}
              onValueChange={itemValue =>
                setDetails({...details, duration: itemValue})
              }>
              <Picker.Item label="1 Week" value="1 Week" />
              <Picker.Item label="10 Days" value="10 Days" />
              <Picker.Item label="20 Days" value="20 Days" />
              <Picker.Item label="1 Month" value="1 Month" />
            </Picker>
          </View>
          <TouchableOpacity onPress={handlesubmit} style={styles.submit}>
            <Text style={styles.addButtonText}>Add To Market</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={suggest}
        onRequestClose={() => setSuggest(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggested Price:</Text>
            <Text style={styles.modalMessage}>₹{value / 100} per KG</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSuggest(false)}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Filldetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 20,
    paddingBottom: 60, // Padding to avoid overlap with bottom bar
  },
  choice: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 8,
    marginVertical: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Ensure space between image and text
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: '#029429',
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  unselected: {
    backgroundColor: '#fafdf4',
    width: '45%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#029429',
  },
  selected: {
    backgroundColor: '#029429',
    width: '45%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: '#029429',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#029429', // Default button text color
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
  },
  selectedButtonText: {
    color: '#fafdf4', // Selected button text color
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
  },
  addButtonText: {
    color: '#fafdf4', // Selected button text color
    fontWeight: 'bold',
    fontSize: 20,
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#029429',
    borderWidth: 2,
    paddingHorizontal: 15,
    color: '#029429',
    fontSize: 16,
    marginVertical: 10,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#029429',
    borderWidth: 2,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#029429',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#029429',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better focus on the modal
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#FF6347', // Tomato color for the close button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
    shadowOffset: {width: 0, height: 5},
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
