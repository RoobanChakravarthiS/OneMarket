import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import homeImg from './home.png';
import stockImg from './sharing.png';
import auctionImg from './auction.png';
import Homestack from './Homestack';
import marketImg from './market.png';
import profile from './profile.png';
import useroutline from './useroutline.png';
import userfill from './userfill.png';
import homeoutline from './homeoutline.png';
import auctionoutline from './auctionoutline.png';
import Home from './Home';
import Auction from './Auction';
import Market from './userMarket';
import Stocks from './Profile';
import notification from './notification.png'
import Chatbot from './Chatbot';
import chatbot from './robotics.png';
const Tab = createBottomTabNavigator();

const Footer = ({ navigation ,route}) => {
  const userId=route.params.userId;
  const username = route.params.username;
  console.log(userId)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'chatbot') {
            iconName = chatbot;
          } else if (route.name === 'Auction') {
            iconName = focused ? auctionImg : auctionoutline;
          } else if (route.name === 'Stocks') {
            iconName = focused ? userfill : useroutline;
          } else if (route.name === 'Home') {
            iconName = focused ? homeImg : homeoutline;
          }

          return (
            <View style={[styles.tabBarIconContainer, focused && styles.tabBarIconContainerFocused]}>
              <Image source={iconName} style={styles.tabBarIcon} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'chatbot') {
            label = 'chatbot';
          } else if (route.name === 'Auction') {
            label = 'Auction';
          } else if (route.name === 'Stocks') {
            label = 'Profile';
          } else if (route.name === 'Home') {
            label = 'Home';
          }

          return (
            <Text style={[styles.tabBarLabel, { color: focused ? '#388E3C' : '#757575' }]}>
              {label}
            </Text>
          );
        },
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#333',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              FIELD FRIEND
            </Text>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => console.log('Profile Pressed')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Home"
        component={Homestack}
        initialParams={{ userId,username }}
      />
      <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#333',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              FIELD FRIEND
            </Text>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => console.log('Profile Pressed')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Auction"
        component={Auction}
        initialParams={{ userId,username }}
      />
      <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#333',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              FIELD FRIEND
            </Text>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => console.log('Profile Pressed')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Stocks"
        component={Stocks}
        initialParams={{ username,userId }}
      />
      <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: '#333',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Text style={styles.headerTitle}>
              FIELD FRIEND
            </Text>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => console.log('Profile Pressed')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="chatbot"
        component={Chatbot}
        initialParams={{ username,userId }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#ffffff',
    elevation: 0,
  },
  headerTitle: {
    color: '#388E3C', // Darker green for header title
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightContainer: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    resizeMode: 'contain',
  },
  tabBarStyle: {
    height: 60,
    backgroundColor: '#e8f5e9', // Slightly darker light background for tab bar
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#b0bec5', // Slightly darker border for subtle separation
  },
  tabBarLabel: {
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 5,
  },
  tabBarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    // backgroundColor: '#e0e0e0', // Slightly darker light background for icon container
    borderRadius: 12,
  },
  tabBarIconContainerFocused: {
    backgroundColor: '#c8e6c9', // Slightly darker green for focused state
    borderRadius: 12,
    padding: 8,
    transform: [{ scale: 1.1 }],
    elevation: 4,
    shadowColor: '#00000025',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  tabBarIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    // backfaceVisibility:'hidden'
  },
});

export default Footer;
