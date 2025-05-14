import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App';

type LandingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Landing'>;
};

export default function LandingScreen({ navigation }: LandingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLoginPress = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      navigation.navigate('Login');
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>
        <Text style={styles.taglinePart}>Learn it. Wear it.</Text>
        <Text style={styles.taglinePart}> Own it.</Text>
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          style={[styles.button, styles.activeButton]}
        >
          <Text style={[styles.buttonText, styles.activeText]}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 400, // Increased from 200 to 300 for better visibility
    height: 300, // Increased from 200 to 300
     // Adjusted margin for better spacing
  },
  brandTitle: {
    fontSize: 40,
    fontFamily: 'Georgia',
    fontWeight: 'normal',
    color: '#000',
   
  },
  tagline: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  taglinePart: {
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: '#000',
  },
  taglineOwn: {
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 25,
    padding: 5,
    width: '80%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});