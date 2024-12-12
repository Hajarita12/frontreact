// components/HomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const HomePage = () => {
  const [message, setMessage] = useState('');

  const callBackend = async () => {
    try {
      const response = await fetch('https://246f-41-142-180-192.ngrok-free.app/api/hello', {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Erreur HTTP', response.status);
        throw new Error('Réponse du backend incorrecte');
      }

      const data = await response.text();
      console.log(data);
      setMessage(data); // Mettre à jour l'état avec le message du backend
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la récupération des données');
    }
  };

  useEffect(() => {
    callBackend();
  }, []);

  return (
    <View>
      <Text>Bienvenue sur la page d'accueil !</Text>
      <Text>{message}</Text> {/* Affiche la réponse du backend */}
      <Button title="Appeler le Backend" onPress={callBackend} />
    </View>
  );
};

export default HomePage;
