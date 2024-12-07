import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import profile from './profile.png'; // Assuming this is the vendor profile image

const Payment = ({ route, navigation }) => {
  // Extract vendor data from route params
  console.log(route.params)
  const  vendor  = route.params.item;
  const name = route.params.username
  console.log(vendor)
  // console.log(username)
  const handleNegotiate = () => {
    // Handle negotiation logic
    navigation.navigate('Negotiation',{vendor})

    console.log("Negotiation initiated");
  };

  const handleBuyNow = () => {
    // Handle buy now logic
    console.log("Buy Now clicked");
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Image source={profile} style={styles.imagetop} />
        <View style={styles.vendorDetails}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.text}>Price: ₹{vendor.price}</Text>
          <Text style={styles.text}>
            Rating: {vendor.negotiable ? 'Negotiable' : 'Fixed Price'}
          </Text>
          <Text style={styles.text}>
            Sales: {vendor.bulk ? 'BULK' : ''} {vendor.bulk && vendor.retail ? '/' : ''} {vendor.retail ? 'RETAIL' : ''}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {vendor.negotiable&&<TouchableOpacity style={styles.negotiationButton} onPress={handleNegotiate}>
            <Text style={styles.buttonText}>Negotiate</Text>
          </TouchableOpacity>}
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  imagetop: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  vendorDetails: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  negotiationButton: {
    backgroundColor: '#FF6347', // Tomato color for contrast
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  buyNowButton: {
    backgroundColor: '#006400', // Dark green color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Payment;
