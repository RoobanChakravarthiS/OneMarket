import React from 'react';
import {ImageBackground, TouchableHighlight} from 'react-native';
import {Text, View, TextInput, StyleSheet, Platform} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {NetworkInfo} from 'react-native-network-info';

const Login = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  // const [userId,setUserId] = useState(null)
  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  // const [ipAddress, setIpAddress] = useState('');

  // useEffect(() => {
  //   console.log("Fetching IP address...");
  //   NetworkInfo.getIPV4Address().then(ipv4Address => {
  //     setIpAddress(ipv4Address); // Update the state with the IP address
  //     console.log("IP Address fetched:", ipv4Address);
  //   });
  // }, []);

  const onSubmit = async data => {
    console.log(data);
    try {
      const response = await fetch(`http://192.168.23.154:1102/farmer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        alert('Invalid username or password');
        return;
      }

      if (response.status === 500) {
        throw new Error('Error: ' + response.statusText);
      }

      const responseData = await response.json();

      if (responseData) {
        await AsyncStorage.setItem('userid', responseData.id);
        console.log(responseData.id);
        // setUserId(responseData.userid)
        const userId = responseData.id;
        const username = responseData.username;
        console.log(userId);
        navigation.navigate('UserDecision', {responseData});
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const backgroundImage = require('./bg.jpg');
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      blurRadius={10}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View>
            <Controller
              control={control}
              name="username"
              rules={{required: 'Username is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.username && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Username"
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="password"
              rules={{required: 'Password is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableHighlight
            style={styles.button}
            underlayColor="#45c52a"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSubmit(onSubmit)}>
            <Text
              style={[
                styles.buttonText,
                {color: isPressed ? 'black' : 'white'},
              ]}>
              LOGIN
            </Text>
          </TouchableHighlight>
          <View style={styles.signIn}>
            <Text>Forgot Password</Text>
            <Text
              onPress={() => navigation.navigate('Signup')}
              style={{color: '#000000'}}>
              New user?? sign UP
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    width: '80%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    borderRadius: 16,
    backgroundColor: '#F1F1F1',
    color: '#000000',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'System', // Default system font on iOS
      android: 'sans-serif', // Default system font on Android
    }),
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    paddingLeft: 8,
    paddingTop: 4,
    fontFamily: Platform.select({
      ios: 'System', // Default system font on iOS
      android: 'sans-serif', // Default system font on Android
    }),
  },
  button: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: Platform.select({
      ios: 'System', // Default system font on iOS
      android: 'sans-serif', // Default system font on Android
    }),
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },
  signIn: {
    display: 'flex',
    flexDirection: 'row',
    gap: 34,
    paddingTop: 15,
    fontFamily: Platform.select({
      ios: 'System', // Default system font on iOS
      android: 'sans-serif', // Default system font on Android
    }),
    fontStyle: 'italic',
  },
});

export default Login;
