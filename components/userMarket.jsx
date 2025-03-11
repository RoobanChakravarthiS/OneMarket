import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  LogBox,
} from 'react-native';
import Slider from '@react-native-community/slider';
import SliderComponent from './Slider.jsx'; // Your existing slider component
import profile from './profile.png';
import LottieView from 'lottie-react-native';

// Suppress warnings about deprecated methods
LogBox.ignoreLogs(['Warning: ...']);

const Market = ({navigation, route}) => {
  const userId = route.params.userId;
  const username = route.params.username;
  const [curr, setCurr] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({
    priceRange: [0, 100], // Adjust based on your needs
    negotiable: '',
    bulk: '',
    retail: '',
  });
  const [data, setData] = useState([]); // Store fetched market data

  useEffect(() => {
    const fetching = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://192.168.23.154:1102/products/allproducts',
        ); // Update to your backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const fetchedData = await response.json();
        setData(fetchedData); // Store fetched data
        console.log('Fetched Data:', fetchedData); // Debug: Log fetched data
        applyFilters(fetchedData); // Apply filters initially
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetching();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (data.length > 0) {
      applyFilters(data); // Apply filters whenever data or curr changes
    }
  }, [curr, data, filter]);

  const applyFilters = data => {
    const idToFilter = curr + 1;

    // Filter by id
    const filteredByid = data.filter(item => item.id === idToFilter);
    console.log('Data After id Filter:', filteredByid);

    // Apply each filter
    const filteredByPriceRange = filterByPriceRange(filteredByid);
    console.log('Data After Price Range Filter:', filteredByPriceRange);

    const filteredByNegotiable = filterByNegotiable(filteredByPriceRange);
    console.log('Data After Negotiable Filter:', filteredByNegotiable);

    const filteredByBulk = filterByBulk(filteredByNegotiable);
    console.log('Data After Bulk Filter:', filteredByBulk);

    const filteredByRetail = filterByRetail(filteredByBulk);
    console.log('Data After Retail Filter:', filteredByRetail);

    setFilteredData(filteredByRetail);
  };

  const filterByPriceRange = items => {
    return items.filter(
      item =>
        Number(item.price) >= filter.priceRange[0] &&
        Number(item.price) <= filter.priceRange[1],
    );
  };

  const filterByNegotiable = items => {
    if (!filter.negotiable) return items;
    return items.filter(
      item =>
        (filter.negotiable === 'Negotiable' && item.negotiable) ||
        (filter.negotiable === 'Fixed Price' && !item.negotiable),
    );
  };

  const filterByBulk = items => {
    if (!filter.bulk) return items;
    return items.filter(item => item.bulk === (filter.bulk === 'BULK'));
  };

  const filterByRetail = items => {
    if (!filter.retail) return items;
    return items.filter(item => item.retail === (filter.retail === 'RETAIL'));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOrder = item => {
    console.log('Order Item:', item); // Debug: Log selected item
    navigation.navigate('Payment', {item, username});
  };

  const FilterButton = ({title, value}) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        {backgroundColor: filter[value] === title ? '#007BFF' : '#e0e0e0'},
      ]}
      onPress={() =>
        setFilter(prev => ({
          ...prev,
          [value]: filter[value] === title ? '' : title,
        }))
      }>
      <Text style={styles.filterOptionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.sliderContainer}>
          <SliderComponent curr={curr} setCurr={setCurr} />
        </View>
      </View>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('./farmer.json')} // replace with your Lottie file path
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.vendorList}>
          <View style={styles.vendorListWrapper}>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <View key={index} style={styles.vendorCards}>
                  <Image source={profile} style={styles.imagetop} />
                  <View style={styles.vendorDetails}>
                    <Text style={styles.text}>Farmer: {username}</Text>
                    <Text style={styles.text}>Crop: {item.crop}</Text>
                    <Text style={styles.text}>Price: ₹{item.price}</Text>
                    <Text style={styles.text}>
                      Rating: {item.negotiable ? 'Negotiable' : 'Fixed Price'}
                    </Text>
                    <Text style={styles.text}>
                      Sales: {item.bulk ? 'BULK' : ''}{' '}
                      {item.bulk && item.retail ? '/' : ''}{' '}
                      {item.retail ? 'RETAIL' : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookNow}
                    onPress={() => handleOrder(item)}>
                    <Text style={styles.buttonText}>Order</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.text}>No items available.</Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal for filters */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            <Text style={styles.filterTitle}>Price Range</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100} // Adjust based on your price range
              step={1}
              value={filter.priceRange[0]}
              onValueChange={value =>
                setFilter(prev => ({
                  ...prev,
                  priceRange: [value, prev.priceRange[1]],
                }))
              }
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#e0e0e0"
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100} // Adjust based on your price range
              step={1}
              value={filter.priceRange[1]}
              onValueChange={value =>
                setFilter(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], value],
                }))
              }
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#e0e0e0"
            />
            <Text style={styles.sliderText}>
              Price: ₹{filter.priceRange[0]} -₹{filter.priceRange[1]}
            </Text>

            <Text style={styles.filterTitle}>Negotiable</Text>
            <View style={styles.buttonGroup}>
              <FilterButton title="Negotiable" value="negotiable" />
              <FilterButton title="Fixed Price" value="negotiable" />
            </View>

            <Text style={styles.filterTitle}>Bulk</Text>
            <View style={styles.buttonGroup}>
              <FilterButton title="BULK" value="bulk" />
              <FilterButton title="No BULK" value="bulk" />
            </View>

            <Text style={styles.filterTitle}>Retail</Text>
            <View style={styles.buttonGroup}>
              <FilterButton title="RETAIL" value="retail" />
              <FilterButton title="No RETAIL" value="retail" />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                applyFilters(data); // Apply filters with current data
                toggleModal();
              }}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: '#f0fdf4', // Soft green background for a fresh and natural look
  },
  cardContainer: {
    backgroundColor: '#e0f7e8', // Slightly lighter green for contrast
    height: '35%',
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 2,
    borderTopColor: '#a7d6a3', // Subtle border for a layered effect
  },
  sliderContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: '#006400', // Darker green for a stronger contrast
    borderRadius: 15, // More rounded for a modern feel
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1, // Slight letter spacing for a more refined look
  },
  vendorList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  vendorListWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorCards: {
    backgroundColor: '#ffffff', // White background for clean contrast
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    width: '95%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    height: 130,
    borderColor: '#dcdcdc', // Subtle border for a refined touch
    borderWidth: 1,
  },
  imagetop: {
    width: 60,
    height: 60,
    borderRadius: 30, // Rounded image for a more polished appearance
    marginRight: 15,
    borderColor: '#a7d6a3', // Matching border with cardContainer
    borderWidth: 2,
  },
  vendorDetails: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  bookNow: {
    backgroundColor: '#006400', // Matching button color
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  bookNowText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    fontSize: 18,
    color: '#555555',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 15,
  },
  sliderText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  filterOption: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterOptionText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#006400', // Consistent color with other buttons
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginTop: 20,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8, // Slight letter spacing for a refined look
  },
  closeButton: {
    backgroundColor: '#FF6347', // Distinct close button color
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignSelf: 'flex-end',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
});

export default Market;
