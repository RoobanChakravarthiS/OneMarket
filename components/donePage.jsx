import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';

const PaymentDone = ({navigation}) => {
    setTimeout(()=>{
        navigation.navigate('Home')
    },4000)
  return (
    <View style={styles.container}>
      <LottieView
        source={require('./Done.json')} // replace with your Lottie file path
        autoPlay
        loop={false}
        style={styles.animation}
      />
      {/* <Text style={styles.text}>Added to Market!</Text> */}
    </View>
  );
};

export default PaymentDone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  animation: {
    width: 150,
    height: 150,
  },
  text: {
    color: '#029429',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
