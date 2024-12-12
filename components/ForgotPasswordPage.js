import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour envoyer le code de vérification
  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://9658-196-113-20-100.ngrok-free.app/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Un code de vérification a été envoyé à votre email');
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'envoi du code de vérification');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser le mot de passe
  const resetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://2879-196-121-158-254.ngrok-free.app/users/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', 'Votre mot de passe a été réinitialisé avec succès');
        navigation.navigate('Login'); // Rediriger l'utilisateur vers la page de connexion
      } else {
        Alert.alert('Erreur', data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la réinitialisation du mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Réinitialiser votre mot de passe</Text>
      
      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 }}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez votre email"
      />
      
      <Button title="Envoyer le code de vérification" onPress={sendVerificationCode} disabled={isLoading} />
      
      <Text style={{ marginTop: 20 }}>Code de vérification:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 }}
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="Entrez le code de vérification"
      />
      
      <Text>Nouveau mot de passe:</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 }}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Entrez votre nouveau mot de passe"
        secureTextEntry
      />
      
      <Button title="Réinitialiser le mot de passe" onPress={resetPassword} disabled={isLoading} />
    </View>
  );
};

export default ForgotPasswordPage;
