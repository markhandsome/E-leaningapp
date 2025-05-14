import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App'; // make sure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Auth';
import * as firebase from 'firebase/app';

// define the navigation prop for this screen
type LoginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlelogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid email format');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        navigation.navigate('Learning');
      }
    } catch (error: any) {
      const errorCode = error.code;

      switch (errorCode) {
        case 'auth/user-not-found':
          Alert.alert('No account found with this email.');
          break;
        case 'auth/wrong-password':
          Alert.alert('Incorrect password.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Invalid email address.');
          break;
        default:
          Alert.alert('Login failed', error.message);
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello Again</Text>
      <Text style={styles.welcome}>Designer</Text>
      <Text style={styles.placeholder}>Email</Text>
      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#555555"
      />
      <Text style={styles.placeholder}>Password</Text>
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#555555"
      />

      <TouchableOpacity>
        <Text style={styles.recover}>Recover Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInBtn} onPress={handlelogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or continue with</Text>

      <View style={styles.socials}>
        <Image source={require('../assets/facebook.png')} style={styles.icon} />
        <Image source={require('../assets/Linkedin.png')} style={styles.icon} />
        <Image source={require('../assets/Youtube.png')} style={styles.icon} />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.register}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
  },
  placeholder: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 2,
    fontSize: 18,
    textAlign: 'left',
    color: '#333333', // Dark gray
  },
  hello: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#333333', // Dark gray
  },
  welcome: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 80,
    color: '#555555', // Medium gray
  },
  input: {
    backgroundColor: '#F5F5F5', // Light gray
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    color: '#333333', // Dark gray text
  },
  recover: {
    alignSelf: 'flex-end',
    color: '#333333', // Dark gray
    marginBottom: 20,
  },
  signInBtn: {
    backgroundColor: '#333333', // Dark gray
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInText: {
    color: '#FFFFFF', // White
    fontWeight: 'bold',
  },
  or: {
    marginVertical: 15,
    color: '#666666', // Medium gray
  },
  socials: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    tintColor: '#555555', // Medium gray
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: {
    color: '#666666', // Medium gray
  },
  register: {
    color: '#333333', // Dark gray
    fontWeight: 'bold',
  },
});