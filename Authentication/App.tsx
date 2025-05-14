import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LandingScreen from './LandingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import LearningScreen from '../Screen/Learningscreen';
import PatternDraftingScreen from '../Screen/PatternDraftingScreen';
import LayoutCutScreen from '../Screen/LayoutCutScreen';
import ThreatsSewingScreen from '../Screen/ThreatsSewingScreen';
import SewingMachinePartsScreen from '../Screen/SewingMachinePartsScreen';
import Profile from '../Screen/Profile';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  Learning: undefined;
  PatternDraftingScreen: undefined;
  LayoutCutScreen: undefined;
  ThreatsSewingScreen: undefined;
  SewingMachinePartsScreen: undefined;
  Profile: undefined;

};


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          ...TransitionPresets.FadeFromBottomAndroid,
        }}
      >
        
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
        <Stack.Screen name="Learning" component={LearningScreen}/>
        
        <Stack.Screen name="PatternDraftingScreen" component={PatternDraftingScreen}/>
        <Stack.Screen name="LayoutCutScreen" component={LayoutCutScreen}/>
        <Stack.Screen name="ThreatsSewingScreen" component={ThreatsSewingScreen}/>
        <Stack.Screen name="SewingMachinePartsScreen" component={SewingMachinePartsScreen}/>
        <Stack.Screen name="Profile" component={Profile}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
