import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Modal,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const Stocks = ({route}) => {
  const username = route.params.username;
  const userId = route.params.userId;
  const initialDetails = {
    number: '9876543210',
    aadhar: '123412341234',
    doorNo: '123',
    street: 'Main Street',
    town: 'Metropolis',
    district: 'Central',
    state: 'California',
    pincode: '123456',
    imageUri: null,
    age: 28,
  };

  const [isEditable, setIsEditable] = useState(false);
  const [userDetails, setUserDetails] = useState(initialDetails);

  const handleImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true, // To make the cropping area circular
    })
      .then(image => {
        setUserDetails({
          ...userDetails,
          imageUri: image.path,
        });
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const handleInputChange = (name, value) => {
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    25;
    console.log('Starting submission');
    const {number, aadhar, pincode} = userDetails;

    if (number.length < 10 || aadhar.length < 12 || pincode.length < 6) {
      Alert.alert('Error', 'Please ensure all fields are correctly filled.');
      return;
    }

    const formData = new FormData();

    // Add JSON data as a stringified object
    const jsonPayload = {
      userid: userId,
      age: userDetails.age,
      mobile: userDetails.number,
      aadhaar: userDetails.aadhar,
      door_no: userDetails.doorNo,
      street: userDetails.street,
      town: userDetails.town,
      district: userDetails.district,
      state: userDetails.state,
      pin_code: userDetails.pincode,
    };

    formData.append('data', JSON.stringify(jsonPayload));

    // Add the image to formData if available
    if (userDetails.imageUri) {
      const imageName = userDetails.imageUri.split('/').pop();
      const imageType = `image/${imageName.split('.').pop()}`;

      formData.append('photo', {
        uri: userDetails.imageUri,
        name: imageName,
        type: imageType,
      });
    }

    try {
      console.log('Submitting form data:', formData);
      const response = await fetch(
        'http://192.168.23.154:1102/updateuserdetails',
        {
          method: 'PUT',
          body: formData,
        },
      );

      console.log('Response status:', response.status);
      if (response.status === 204) {
        Alert.alert('Success', 'Details updated successfully!');
        setIsEditable(false);
      } else {
        console.log('Response error:', await response.text());
        Alert.alert('Error', 'Failed to update details.');
      }
    } catch (error) {
      console.error('API Error: ', error);
      Alert.alert('Error', 'An error occurred while updating details.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.uneditableContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>UserID:</Text>
            <Text style={styles.text}>{userId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{username}</Text>
          </View>
          {/* Display uploaded image below the Name field in the uneditable view */}
          {!isEditable && userDetails.imageUri && (
            <Image
              source={{uri: userDetails.imageUri}}
              style={styles.profileImage}
            />
          )}
        </View>

        <View style={styles.editableContainer}>
          {!isEditable ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Number:</Text>
                <Text style={styles.text}>{userDetails.number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Age:</Text>
                <Text style={styles.text}>{userDetails.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Aadhar Number:</Text>
                <Text style={styles.text}>{userDetails.aadhar}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Door No:</Text>
                <Text style={styles.text}>{userDetails.doorNo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Street:</Text>
                <Text style={styles.text}>{userDetails.street}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Town:</Text>
                <Text style={styles.text}>{userDetails.town}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>District:</Text>
                <Text style={styles.text}>{userDetails.district}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>State:</Text>
                <Text style={styles.text}>{userDetails.state}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Pincode:</Text>
                <Text style={styles.text}>{userDetails.pincode}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="Enter phone number"
                  value={userDetails.number}
                  onChangeText={value => handleInputChange('number', value)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="Enter your age"
                  value={userDetails.age}
                  onChangeText={value => handleInputChange('age', value)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Aadhar Number:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={12}
                  placeholder="Enter Aadhar number"
                  value={userDetails.aadhar}
                  onChangeText={value => handleInputChange('aadhar', value)}
                />
              </View>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImagePicker}>
                <Text style={styles.imagePickerText}>Upload Profile Image</Text>
              </TouchableOpacity>
              <View style={styles.addressContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Door No:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter door number"
                    value={userDetails.doorNo}
                    onChangeText={value => handleInputChange('doorNo', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Street:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter street"
                    value={userDetails.street}
                    onChangeText={value => handleInputChange('street', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Town:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter town"
                    value={userDetails.town}
                    onChangeText={value => handleInputChange('town', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>District:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter district"
                    value={userDetails.district}
                    onChangeText={value => handleInputChange('district', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>State:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter state"
                    value={userDetails.state}
                    onChangeText={value => handleInputChange('state', value)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pincode:</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Enter pincode"
                    value={userDetails.pincode}
                    onChangeText={value => handleInputChange('pincode', value)}
                  />
                </View>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditable(!isEditable)}>
          <Text style={styles.editButtonText}>
            {isEditable ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {isEditable && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Stocks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  uneditableContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    alignItems: 'center', // Center the content horizontally
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%', // Ensure it spans full width
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  editableContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
    gap: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f0f0f0',
  },
  imagePicker: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressContainer: {
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
