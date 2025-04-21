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
import { RootStackParamList } from '../App';

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
    <Animated.View style={[styles.container, {
      backgroundColor: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#F5F3FF', '#FFFFFF'],
      }),
    }]}>
      <Image
        source={require('../assets/Register.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Master Sewing{'\n'}with Easy{'\n'}Tutorials</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={()=> navigation.navigate ('SignUp')} style={[styles.button, styles.activeButton]}>
          <Text style={[styles.buttonText, styles.activeText]}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>rtd
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginVertical: 20,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 5,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
