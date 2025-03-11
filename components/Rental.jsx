import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {Linking} from 'react-native';
const equipmentImages = {
  tractor: require('./tracter.jpeg'),
  plough: require('./plough.jpg'),
  harvester: require('./harvester.jpeg'),
  seeder: require('./seeder.jpeg'),
  pump: require('./irrigationpump.jpg'),
};

const EquipmentRental = ({navigation}) => {
  const [equipments, setEquipments] = useState([
    {
      id: '1',
      name: 'Tractor',
      price: 50,
      description: 'High-power tractor for all farming needs.',
      image: equipmentImages.tractor,
      owner: 'John Doe',
      location: 'Village A',
      rating: 4.5,
      mobile: 9025796362,
    },
    {
      id: '2',
      name: 'Plough',
      price: 20,
      description: 'Durable plough for efficient land preparation.',
      image: equipmentImages.plough,
      owner: 'Michael Smith',
      location: 'Village B',
      rating: 4.2,
      mobile: 9486163958,
    },
    {
      id: '3',
      name: 'Harvester',
      price: 80,
      description: 'Modern harvester for efficient crop collection.',
      image: equipmentImages.harvester,
      owner: 'Emily Johnson',
      location: 'Village C',
      rating: 4.8,
      mobile: 9025796362,
    },
    {
      id: '4',
      name: 'Seeder',
      price: 30,
      description: 'Automatic seeder for precise sowing.',
      image: equipmentImages.seeder,
      owner: 'David Brown',
      location: 'Village D',
      rating: 4.3,
      mobile: 9025796362,
    },
    {
      id: '5',
      name: 'Irrigation Pump',
      price: 25,
      description: 'Efficient water pump for irrigation needs.',
      image: equipmentImages.pump,
      owner: 'Sarah Wilson',
      location: 'Village E',
      rating: 4.6,
      mobile: 9025796362,
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentalDuration, setRentalDuration] = useState('');

  const openRentModal = item => {
    setSelectedEquipment(item);
    setModalVisible(true);
  };

  const handleRentConfirm = () => {
    navigation.navigate('PaymentDone');
    console.log(
      `Renting ${selectedEquipment.name} for ${rentalDuration} days.`,
    );
    setModalVisible(false);
  };

  const renderItem = ({item}) => (
    <View key={item.id} style={styles.displayCard}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>Rent: ${item.price}/day</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.owner}>Owner: {item.owner}</Text>
        <Text style={styles.location}>Location: {item.location}</Text>
        <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openRentModal(item)}>
          <Text style={styles.buttonText}>Take Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.negotiateButton}>
          <Text style={styles.buttonText}>Negotiate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${item.mobile}`)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={equipments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Rent {selectedEquipment?.name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter rental duration (days)"
              keyboardType="numeric"
              value={rentalDuration}
              onChangeText={setRentalDuration}
            />
            <TouchableOpacity style={styles.button} onPress={handleRentConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
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

export default EquipmentRental;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  displayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 5,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  image: {
    borderRadius: 10,
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  detailsContainer: {alignItems: 'center', marginBottom: 10},
  title: {fontSize: 18, fontWeight: 'bold', color: '#004d40'},
  price: {fontSize: 16, color: '#00796b'},
  description: {fontSize: 14, color: '#616161', textAlign: 'center'},
  owner: {fontSize: 14, color: '#333', fontWeight: 'bold'},
  location: {fontSize: 14, color: '#444'},
  rating: {fontSize: 14, color: '#ff9800'},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {backgroundColor: '#004d40', padding: 10, borderRadius: 10},
  negotiateButton: {backgroundColor: '#FFA500', padding: 10, borderRadius: 10},
  callButton: {backgroundColor: '#008CBA', padding: 10, borderRadius: 10},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
