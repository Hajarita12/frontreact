import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';  // Import navigation

const ImagePickerPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();  // Initialize navigation

  const handleImageChange = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    Alert.alert("Erreur", "Permission refusée pour accéder à la galerie.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);  // Assurez-vous que l'URI de l'image est stockée ici
    setErrorMessage(null);
    console.log("DEBUG: Image sélectionnée ->", result.assets[0].uri);
  }
};

  // Send the image to the backend
// In ImagePickerPage
const handleSubmit = async () => {
  if (!selectedImage) {
    setErrorMessage("Aucune image sélectionnée.");
    return;
  }

  const formData = new FormData();
  formData.append("image", {
    uri: selectedImage,
    name: "image.jpg",
    type: "image/jpeg",
  });

  // Add other data you need to send, e.g., km, seats, etc.
  formData.append("mileage", 12345);  // example of form data

  try {
    const response = await fetch("https://86ba-196-113-20-100.ngrok-free.app/predict", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la soumission");
    }

    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      setPredictionResult(data);
      setErrorMessage(null);
    }
  } catch (error) {
    console.error("Erreur lors de la soumission :", error);
    setErrorMessage(`Erreur : ${error.message}`);
  }
};

// Pass the selected image URI to CarForm
navigation.navigate('CarForm', { selectedImage });


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détection d'image</Text>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.image}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleImageChange}>
        <Text style={styles.buttonText}>Choisir une image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Envoyer l'image</Text>
      </TouchableOpacity>

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {predictionResult && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Résultat de la prédiction :</Text>
          <Text>Marque & Modèle : {predictionResult.class_name}</Text>
        </View>
      )}

      {/* Arrow Button to navigate to the form page */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('CarForm')} // Navigate to the form page
      >
        <Text style={styles.arrowText}>↓</Text> {/* Arrow symbol */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f5f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#4a4a4a",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
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
  error: {
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4a4a4a",
  },
  arrowButton: {
    marginTop: 20,
    backgroundColor: "#6c63ff",
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
  },
  arrowText: {
    fontSize: 30,
    color: "#fff",
  },
});

export default ImagePickerPage;
