import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import ImagePickerPage from './components/ImagePickerPage';
import CarForm from './components/CarForm';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ title: 'Connexion' }} />
        <Stack.Screen name="SignUp" component={SignUpPage} options={{ title: 'Créer un compte' }} />
        <Stack.Screen name="image" component={ImagePickerPage} options={{ title: 'Accueil' }} />
        <Stack.Screen name="CarForm" component={CarForm} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} options={{ title: 'Réinitialiser le mot de passe' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
