import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';
import {createAppContainer, createSwitchNavigator } from 'react-navigation';
console.disableYellowBox=true;

export default function App() {
  return (
    <AppContainer></AppContainer>
  );
}

const switchNavigator = createSwitchNavigator({
  welcomeScreen : {screen:WelcomeScreen},
  drawer : {screen:AppDrawerNavigator}
})
const AppContainer = createAppContainer(switchNavigator);