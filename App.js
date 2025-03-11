import {StatusBar} from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Login from './components/login';
import Backarrow from './components/back-arrow.png';
import Signup from './components/signup';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import profile from './components/profile.png';
import FertilizerMarket from './components/fertilizerMarket';
import Footer from './components/Footer';
import Addproducts from './components/addproducts';
import Auctionbuy from './components/Auctionbuy';
import AuctionRooms from './components/auctionRooms';
import Roomlist from './components/Roomlist';
import HostAuction from './components/auctionhost';
import Hostselection from './components/Hostseletion';
import notification from './components/notification.png';
import Payment from './components/Paymentpage';
import Negotiation from './components/Negotiation';
import StartAuction from './components/StartAuction';
import Market from './components/userMarket';
import InsuranceClaim from './components/Insurance';
import PlantDiseaseDetection from './components/CropDoctor';
import OnboardingScreen1 from './components/Screen1';
import OnboardingScreen2 from './components/Screen2';
import OnboardingScreen3 from './components/Screen3';
import Decisionpage from './components/Decisionpage';
import EquipmentRental from './components/Rental';
import NegotiationChatScreen from './components/NegotiationChat';
import NegotiationListScreen from './components/NegotiationList';
import CropInvestmentForm from './components/Createshares';
import PaymentDone from './components/donePage';
import Filldetails from './components/Filldetails';
import AddRental from './components/AddRental';
import ShareListingScreen from './components/ShareList';
import ContractListScreen from './components/ContractListScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={({navigation}) => ({headerShown: false})}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Main"
          component={Footer}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="insurance"
          component={InsuranceClaim}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="shareslist"
          component={ShareListingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="contractlist"
          component={ContractListScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="FertilizerMarket"
          component={FertilizerMarket}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="addproducts"
          component={Addproducts}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="CropDoctor"
          component={PlantDiseaseDetection}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AddRental"
          component={AddRental}
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
        <Stack.Screen
          options={{headerShown: false}}
          name="market"
          component={Market}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="rental"
          component={EquipmentRental}
        />
        <Stack.Screen name="NegotiationList" component={NegotiationListScreen} options={{ title: "Negotiations" }} />
        <Stack.Screen
          name="NegotiationChat"
          component={NegotiationChatScreen}
          options={({ route }) => ({ title: route.params.negotiation.user })}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding1"
          component={OnboardingScreen1}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="shares"
          component={CropInvestmentForm}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding2"
          component={OnboardingScreen2}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Onboarding3"
          component={OnboardingScreen3}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="UserDecision"
          component={Decisionpage}
        />

        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate('NegotiationList')}
            //     style={{marginLeft: 10}}></TouchableOpacity>
            // ),
          })}
          name="startAuctions"
          component={StartAuction}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate('NegotiationList')}
            //     style={{marginLeft: 10}}></TouchableOpacity>
            // ),
          })}
          name="SentRequest"
          component={Request}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate('NegotiationList')}
            //     style={{marginLeft: 10}}></TouchableOpacity>
            // ),
          })}
          name="auctionRooms"
          component={AuctionRooms}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="addpro"
          component={Addproducts}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="auctionBuy"
          component={Auctionbuy}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="room"
          component={Roomlist}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="hosting"
          component={HostAuction}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="hostselect"
          component={Hostselection}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="Payment"
          component={Payment}
        />
        <Stack.Screen
          options={({navigation}) => ({
            headerStyle: {
              backgroundColor: '#f0fdf4',
            },
            headerTintColor: '#faf6f9',
            headerTitleAlign: 'center',
            headerTitle: () => <Text style={styles.text}>FIELD FRIEND</Text>,
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity onPress={() => console.log('Notification Pressed')}>
                <Image source={msgImg} style={styles.imagetop} />
              </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('NegotiationList')}>
                  <Image source={notification} style={styles.imagetop} />
                </TouchableOpacity>
              </View>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NegotiationList')}
                style={{marginLeft: 10}}></TouchableOpacity>
            ),
          })}
          name="Negotiation"
          component={Negotiation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',

    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bar: {},
  image: {
    width: '60%', // Set width relative to the button's width
    height: undefined, // Allows for aspect ratio to be maintained
    aspectRatio: 1, // Maintain aspect ratio for square image
    resizeMode: 'contain', // Ensures image is fully contained within the view
  },
  imagetop: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    margin: 0,
  },
});
