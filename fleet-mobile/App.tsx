import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import React from 'react';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

