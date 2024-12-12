import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 const handleLogin = async () => {
  try {
    const response = await fetch('https://64d1-196-113-20-100.ngrok-free.app/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Stocker l'ID utilisateur dans AsyncStorage ou tout autre stockage local
      await AsyncStorage.setItem('userId', data.userId);
      console.log('User ID:', data.userId);

      navigation.navigate('image'); // Navigate to ImagePickerPage
    } else {
      setErrorMessage(data.message || 'Erreur de connexion');
    }
  } catch (error) {
    console.error('Erreur:', error);
    setErrorMessage('Erreur de connexion');
  }
};


  return (
    <View style={styles.container}>
      {/* Car logo */}
      <Image 
        source={require('../assets/voiture.png')} // Correct usage for local images
        style={styles.logo}
      />
      <Text style={styles.title}>Connexion</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      
      {/* Rounded login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signupText}>Créer un compte</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F6FF', // Light background color
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25, // Rounded edges for the input fields
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    borderRadius: 25,  // Rounded button
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#007BFF',
    fontSize: 16,
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default LoginPage;
