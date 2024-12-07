import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native'; // Make sure to install and import LottieView
import doctorIMg from './doctor.png';
import ferti from './fertilizer.png';
import plus from './add.png';
import buy from './best-seller.png';
import cloudy from './cloudy.png';

const Home = ({ navigation,route }) => {
  // const username = route.params.username;
  const userId=route.params.userId;
  const username = route.params.username;
  const [loading, setLoading] = useState(true);
  const [weatherdata, setWeatherdata] = useState(null);
  const [error, setError] = useState(null);
  const key = '68c74eb2ccb1589be62b40e7e3514ff0';
  const [city, setCity] = useState('coimbatore');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
        );
        const data = await response.json(); // Parse the response to JSON
        setWeatherdata(data);
        
        setLoading(false);
        
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.log(error)
      }
    };

    fetchWeather();
  }, [city]);

  

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('./loading.json')} // replace with your Lottie file path
            autoPlay
            loop={false}
            style={styles.animation}
          />
          <Text style={styles.text}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.text}>Error: {error}</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.welcometext}>Welcome Back!!</Text>
              <View style={styles.userDetails}>
                <Text style={styles.address}>{username}</Text>
                <View style={styles.weather}>
                  <Image source={cloudy} style={styles.weatherimage} />
                  <Text style={styles.weatherdata}>
                    {weatherdata?.main?.temp}°
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <TouchableOpacity
              id="weather bar"
              style={styles.progress}
              onPress={() => navigation.navigate('userMarket')}
            >
              <Image source={buy} style={styles.icon} />
              <Text style={styles.text}>BUY PRODUCTS</Text>
            </TouchableOpacity>
            <View style={styles.block}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('addproducts')}
              >
                <Image source={plus} style={styles.image} />
                <Text style={styles.buttonText}>PRODUCES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('FertilizerMarket')}
              >
                <Image source={ferti} style={styles.image} />
                <Text style={styles.buttonText}>FERTILIZER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height:300,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardContainer: {
    flexDirection: 'column',
    backgroundColor: '#287344',
    borderRadius: 30,
    padding: 20,
    marginTop: 20,
    height: '40%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 25,
  },
  cardContent: {
    backgroundColor: '#287344',
    flex: 1,
    borderRadius: 15,
  },
  welcometext: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 38,
    paddingLeft: 10,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 25,
  },
  address: {
    fontSize: 30,
    color: '#ffffff',
  },
  weather: {
    fontSize: 25,
    fontWeight: 'bold',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weatherimage: {
    height: 90,
    width: '40%',
  },
  weatherdata: {
    fontSize: 40,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },
  block: {
    width:'90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#287344',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
    width: '90%',
    height: 80,
    justifyContent: 'space-around',
    alignItems:'center',
    gap: 18,
  },
  icon: {
    height: 60,
    width: 56,
  },
  card: {
    flex: 1,
    backgroundColor: '#287344',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
