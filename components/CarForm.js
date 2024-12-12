import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Import to access route params

import AsyncStorage from '@react-native-async-storage/async-storage';

const CarForm = () => {
  const [mileage, setMileage] = useState('');
  const [seats, setSeats] = useState('');
  const [doors, setDoors] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [fuelType, setFuelType] = useState('diesel');
  const [carYear, setCarYear] = useState('');
  const [carColor, setCarColor] = useState('');
  const [otherOption, setOtherOption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State for image
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const route = useRoute();  // Access route params
  const { selectedImage: passedImage } = route.params || {};  // Get the passed image
  
  const [userId, setUserId] = useState(null); // Declare state for userId

useEffect(() => {
  const fetchUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId'); // Retrieve user ID from AsyncStorage
      if (id !== null) {
        setUserId(id);  // Set userId state
      }
    } catch (error) {
      console.log('Error retrieving user ID', error);
    }
  };
  fetchUserId();
}, []);  // Empty dependency array to run only once on mount




  useEffect(() => {
    if (passedImage) {
      setSelectedImage(passedImage);  // Set the image from navigation
    }
  }, [passedImage]);

  const handleSubmit = async () => {
    console.log('Formulaire envoyé');

    // Check if an image has been selected
    if (!selectedImage) {
      setErrorMessage("Aucune image sélectionnée.");
      console.log("Erreur : Aucune image sélectionnée");
      return;
    }

    // Create the form data
    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: "image.jpg",
      type: "image/jpeg",
    });
    formData.append("mileage", mileage);
    formData.append("seats", seats);
    formData.append("doors", doors);
    formData.append("horsepower", horsepower);
    formData.append("fuelType", fuelType);
    formData.append("carYear", carYear);
    formData.append("carColor", carColor);
    formData.append("otherOption", otherOption);
    formData.append("userId", userId);  // Replace with the logged-in user's ID

    console.log('Données du formulaire:', formData);

    try {
      console.log('Envoi de la requête...');
      const response = await fetch("https://98a0-196-113-20-100.ngrok-free.app/api/annonces/create", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      // Check server response
      if (!response.ok) {
        console.log('Erreur lors de la soumission');
        throw new Error("Erreur lors de la soumission de l'annonce");
      }

      const data = await response.json();
      console.log('Réponse du serveur:', data);
      Alert.alert("Annonce créée avec succès", "Votre annonce a été ajoutée.");
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      setErrorMessage(`Erreur : ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Formulaire de voiture</Text>

        {/* Display the selected image */}
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Text>Image sélectionnée:</Text>
            <Text>{selectedImage}</Text>
          </View>
        )}

        <Text>Kilométrage</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le kilométrage"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric"
        />

        <Text>Nombre de sièges</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nombre de sièges"
          value={seats}
          onChangeText={setSeats}
          keyboardType="numeric"
        />

        <Text>Nombre de portes</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez le nombre de portes"
          value={doors}
          onChangeText={setDoors}
          keyboardType="numeric"
        />

        <Text>Chevaux (puissance)</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez la puissance en chevaux"
          value={horsepower}
          onChangeText={setHorsepower}
          keyboardType="numeric"
        />

        <Text>Type de carburant</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text>{fuelType === 'diesel' ? 'Diesel' : 'Essence'}</Text>
        </TouchableOpacity>

        {/* Modal for selecting fuel type */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionner le type de carburant</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setFuelType('diesel');
                setModalVisible(false);
              }}
            >
              <Text>Diesel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setFuelType('gazoile');
                setModalVisible(false);
              }}
            >
              <Text>Essence</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text>Annuler</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text>Couleur</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez la couleur de la voiture"
          value={carColor}
          onChangeText={setCarColor}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F2F6FF",
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: "#6c63ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default CarForm;
