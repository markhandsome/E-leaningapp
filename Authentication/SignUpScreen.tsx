import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './Auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './Auth';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'https://auth.expo.io/capati10/E-learningApp',
    androidClientId: 'https://auth.expo.io/capati10/E-learningApp',
    webClientId: '596495961648-c6mfol0nuid3k0elvr5560fkakago34s.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          alert('Signed in with Google!');
          navigation.navigate('Home');
        })
        .catch((err) => {
          console.error('Firebase Google Sign-In Error:', err);
          alert('Google Sign-In failed.');
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const db = getFirestore(app);
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          firstName: firstName,
          lastName: lastName,
          email: email,
          createdAt: new Date(),
        });
        alert("Account created successfully!");
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.log('Sign-up error:', error.code);
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('This email is already in use.');
          break;
        case 'auth/invalid-email':
          alert('Invalid email address.');
          break;
        default:
          alert('Registration failed. Please try again.');
          break;
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Come Join Us</Text>
          <Text style={styles.subtitle}>Learn Design With Us</Text>

          <Text style={styles.placeholders}>Username</Text>
          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.placeholders}>Name</Text>
          <View style={styles.rowContainer}>
            <TextInput
              placeholder="First Name"
              style={styles.inputRow}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              style={styles.inputRow}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <Text style={styles.placeholders}>Email</Text>
          <TextInput
            placeholder="Enter Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.placeholders}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Password"
              style={styles.inputFlex}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../assets/hide.png')
                    : require('../assets/eye.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.placeholders}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
              style={styles.inputFlex}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Image
                source={
                  showConfirm
                    ? require('../assets/hide.png')
                    : require('../assets/eye.png')
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.or}>or continue with</Text>

          <View style={styles.socials}>
            <TouchableOpacity onPress={() => promptAsync()}>
              <Image source={require('../assets/facebook.png')} style={styles.icon} />
            </TouchableOpacity>
            <Image source={require('../assets/Linkedin.png')} style={styles.icon} />
            <Image source={require('../assets/Youtube.png')} style={styles.icon} />
          </View>

          <View style={styles.loginPrompt}>
            <Text style={{ color: '#888' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
  },
  placeholders: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingLeft: 2,
    fontSize: 18,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  inputRow: {
    backgroundColor: '#F5F5F5',
    width: '48%',
    padding: 15,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    width: '100%',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'gray',
    marginLeft: 10,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: '#FF6B6B',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  or: {
    marginVertical: 15,
    color: '#999',
  },
  socials: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});
