'use client';

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import FeatherSource from './feather.png';
import cloudy from './cloudy.png';
import plus from './add.png';
import ferti from './fertilizer.png';
import insurance from './insurance.png';
import cropDoctor from './crop-doctor.png';
import AgriculturalCycleProgress from './AgriculturalCycleProgress';
import Market from './userMarket';
import market from './market.png';
import shares from './sharing.png'
import tractor from  './tractor.png'
import contract from './contract.png'

const {width} = Dimensions.get('window');
const cardWidth = width * 0.85; // 85% width for horizontal cards

const Home = ({navigation, route}) => {
  const user = route.params.user
  const crop = route.params.selectedCrop;
  console.log(crop)
  const [loading, setLoading] = useState(true);
  const [weatherdata, setWeatherdata] = useState(null);
  const [error, setError] = useState(null);
  const key = '68c74eb2ccb1589be62b40e7e3514ff0';
  const [city, setCity] = useState('coimbatore');
  const [todos, setTodos] = useState([
    {id: 1, task: 'Water the crops', completed: false},
    {id: 2, task: 'Check soil moisture', completed: false},
    {id: 3, task: 'Inspect for pests', completed: false},
  ]);

  const actions = [
    {name: 'Produces', icon: plus, route: 'addproducts'},
    {name: 'Market', icon: market, route: 'market'},
    {name: 'Fertilizer', icon: ferti, route: 'FertilizerMarket'},
    {name: 'Insurance', icon: insurance, route: 'insurance'},
    {name: 'Create shares', icon: shares, route: 'shares'},
    {name: 'View share details', icon: shares, route: 'shareslist'},
    {name: 'Crop Doctor', icon: cropDoctor, route: 'CropDoctor'},
    {name: 'Rental', icon: tractor, route: 'rental'},
    {name: 'Add Rental', icon: tractor, route: 'AddRental'},
    {name: 'contracts', icon: contract, route: 'contractlist'},
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`,
        );
        const data = await response.json();
        setWeatherdata(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.log(error);
      }
    };

    fetchWeather();
  }, [city, key]);

  const toggleTodo = id => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo,
      ),
    );
  };

  const renderActionCard = ({item, index}) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 100}
      style={{
        width: '50%',
        marginBottom: 25,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={[styles.actionCard, {alignItems: 'center'}]}
        onPress={() => navigation.navigate(item.route, {"userId":user.id, "username":user.username})}>
        <Image source={item.icon} style={styles.actionIcon} />
        <Text style={styles.actionText}>{item.name}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const renderContent = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>{user.username}</Text>
          </View>
          <TouchableOpacity
            style={styles.floatingButton}>
            <Image source={FeatherSource} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>


        <Animatable.View
          style={styles.weatherCard}
          animation="fadeInDown"
          duration={1000}>
          <Image source={cloudy} style={styles.weatherImage} />
          <View style={styles.weatherDetails}>
            <Text style={styles.temperatureText}>
              {weatherdata?.main?.temp}°C
            </Text>
            <Text style={styles.cityText}>{city}</Text>
            <Text style={styles.weatherDescription}>
              {weatherdata?.weather[0]?.description}
            </Text>
          </View>
        </Animatable.View>
        <AgriculturalCycleProgress crop={crop} />

        <View style={styles.todoSection}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          {todos.map(todo => (
            <Animatable.View
              key={todo.id}
              animation="fadeInLeft"
              duration={500}
              delay={todo.id * 100}>
              <TouchableOpacity
                style={styles.todoItem}
                onPress={() => toggleTodo(todo.id)}>
                <View
                  style={[
                    styles.checkbox,
                    todo.completed && styles.checkboxChecked,
                  ]}>
                  {todo.completed && (
                    <Icon name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.todoText,
                    todo.completed && styles.todoTextCompleted,
                  ]}>
                  {todo.task}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.actionGrid}>
            <FlatList
              data={actions}
              renderItem={renderActionCard}
              keyExtractor={(item, index) => index}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}} // Fixes alignment
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          {Platform.OS === 'android' ? (
            <LottieView
              source={require('./loading.json')}
              autoPlay
              loop={true
              }
              style={styles.animation}
            />
          ) : (
            <ActivityIndicator size="large" color="#287344" />
          )}
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
  },
  usernameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#287344',
  },
  profileButton: {
    backgroundColor: '#e0f2e9',
    padding: 10,
    borderRadius: 20,
  },
  weatherCard: {
    flexDirection: 'row',
    backgroundColor: '#287344',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherImage: {
    width: 90,
    height: 90,
    marginRight: 20,
  },
  weatherDetails: {
    flex: 1,
  },
  temperatureText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  cityText: {
    fontSize: 20,
    color: '#e0f2e9',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#e0f2e9',
  },
  todoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#287344',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#287344',
  },
  todoText: {
    fontSize: 17,
    color: '#333',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  actionsGrid: {
    // No longer needed
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#287344',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  animation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#287344',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  floatingButton: {
    backgroundColor: '#287344',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  actionListContainer: {
    width: '75%',
    // paddingRight: 20, // Add padding to the right of the list
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
