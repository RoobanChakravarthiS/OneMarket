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
import notification from './notification.png';
import Chatbot from './Chatbot';
import chatbot from './robotics.png';

const Tab = createBottomTabNavigator();

const Footer = ({ navigation, route }) => {
  const user = route.params.responseData;
  const selectedCrop = route.params.newCrop;

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
              <Image source={iconName} style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]} />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'chatbot') {
            label = 'Chatbot';
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
              <TouchableOpacity onPress={() => navigation.navigate('NegotiationList')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Home"
        component={Home}
        initialParams={{ user, selectedCrop }}
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
              <TouchableOpacity onPress={() => navigation.navigate('NegotiationList')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Auction"
        component={Auction}
        initialParams={{ user }}
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
              <TouchableOpacity onPress={() => navigation.navigate('NegotiationList')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="Stocks"
        component={Stocks}
        initialParams={{ user }}
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
              <TouchableOpacity onPress={() => navigation.navigate('NegotiationList')}>
                <Image source={notification} style={styles.profileImage} />
              </TouchableOpacity>
            </View>
          ),
        }}
        name="chatbot"
        component={Chatbot}
        initialParams={{ user }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#ffffff',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#388E3C',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    height: 70,
    backgroundColor: '#ffffff',
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
    elevation: 10,
    shadowColor: '#00000040',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#b0bec5',
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingBottom: 5,
    letterSpacing: 0.5,
  },
  tabBarIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
  },
  tabBarIconContainerFocused: {
    backgroundColor: '#e8f5e9',
    borderRadius: 15,
    padding: 10,
    transform: [{ scale: 1.1 }],
    elevation: 5,
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  tabBarIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  tabBarIconFocused: {
    tintColor: '#388E3C',
  },
});

export default Footer;