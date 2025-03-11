import React from 'react';
import {ImageBackground, TouchableHighlight} from 'react-native';
import {Text, View, TextInput, StyleSheet, Platform} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useState} from 'react';

const Signup = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const onSubmit = async data => {
    try {
      const response = await fetch(`http://192.168.23.154:1102/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        alert('ALready username ');
        return;
      }

      if (response.status === 500 || response.status === 404) {
        throw new Error('Error: ' + response.statusText);
      }

      const responseData = await response.json();
      if (responseData.status === 201) Alert.alert('Created');
      navigation.navigate('Login');
      // if (responseData.token) {
      //   await AsyncStorage.setItem('token', responseData.token);
      //   navigation.navigate('Home');
      // }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const backgroundImage = require('./bg.jpg');

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
              <Text style={styles.errorText}>Username is required</Text>
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
              <Text style={styles.errorText}>Password is required</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="mobile"
              rules={{required: 'Number is required'}}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, errors.mobile && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Mobile Number"
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                />
              )}
            />
            {errors.mobile && (
              <Text style={styles.errorText}>Number is required</Text>
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
              SIGNUP
            </Text>
          </TouchableHighlight>

          <View style={styles.signIn}>
            <Text
              onPress={() => {
                navigation.navigate('Login');
              }}>
              Already Have an Account? SignIN
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
    color: '#000000',
    borderRadius: 16,
    backgroundColor: '#F1F1F1',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
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
      ios: 'System',
      android: 'sans-serif',
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
      ios: 'System',
      android: 'sans-serif',
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
      ios: 'System',
      android: 'sans-serif',
    }),
    fontStyle: 'italic',
  },
});

export default Signup;
