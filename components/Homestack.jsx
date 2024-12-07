import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import FertilizerMarket from './fertilizerMarket';
import userMarket from './userMarket';
import Backarrow from './back-arrow.png';
import Addproducts from './addproducts';
import Filldetails from './Filldetails';
import PaymentDone from './donePage';

const Stack = createNativeStackNavigator();

const Homestack = ({route}) => {
  const userId=route.params.userId;
  const username = route.params.username;
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={Home} 
        initialParams={{ userId ,username}}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="FertilizerMarket" 
        component={FertilizerMarket}
        initialParams={{ userId }}
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Image source={Backarrow} style={styles.headerImage} />
            </TouchableOpacity>
          ),
          headerStyle: styles.headerStyle,
          headerTitle: 'Fertilizer Market',
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen 
        name="userMarket" 
        component={userMarket}
        initialParams={{ userId,username }}
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Image source={Backarrow} style={styles.headerImage} />
            </TouchableOpacity>
          ),
          headerStyle: styles.headerStyle,
          headerTitle: 'User Market',
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen 
        name="addproducts" 
        component={Addproducts}
        initialParams={{ userId,username }}
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Image source={Backarrow} style={styles.headerImage} />
            </TouchableOpacity>
          ),
          headerStyle: styles.headerStyle,
          headerTitle: 'User Market',
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen 
        name="PaymentDone" 
        component={PaymentDone}
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Image source={Backarrow} style={styles.headerImage} />
            </TouchableOpacity>
          ),
          headerStyle: styles.headerStyle,
          headerTitle: 'User Market',
          headerTitleAlign: 'center',
        })}
      />
      <Stack.Screen 
        name="fillDetails" 
        component={Filldetails}
        options={({ navigation }) => ({
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Image source={Backarrow} style={styles.headerImage} />
            </TouchableOpacity>
          ),
          headerStyle: styles.headerStyle,
          headerTitle: 'User Market',
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#f0fdf4',
  },
  headerButton: {
    marginLeft: 10,
  },
  headerImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Homestack;
