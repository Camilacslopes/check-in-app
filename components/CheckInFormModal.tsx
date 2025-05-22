import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckInFormModal({ visible, onClose, onSubmit }: { visible: boolean, onClose: () => void, onSubmit: (entry: any) => void }) {
  const [visitorName, setVisitorName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [imageUri, setImageUri] = useState('');

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please grant camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveCheckIn = async () => {
    try {
      const existingData = await AsyncStorage.getItem('checkin_records');
      const parsed = existingData ? JSON.parse(existingData) : [];
  
      const newEntry = {
        id: Date.now(),
        name: visitorName,
        employee: selectedEmployee,
        reason,
        imageUri,
        checkInTime: new Date().toISOString(),
      };
  
      parsed.push(newEntry);
      await AsyncStorage.setItem('checkin_records', JSON.stringify(parsed));
  
      Alert.alert('Success', 'Check-in saved locally.');
      onSubmit(newEntry); 
      onClose();
  
      setVisitorName('');
      setSelectedEmployee('');
      setReason('');
      setImageUri('');
    } catch (error) {
      console.error('Failed to save check-in:', error);
      Alert.alert('Error', 'Could not save the check-in.');
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>New Check-In</Text>

        <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
          <Text style={styles.cameraButtonText}>
            {imageUri ? 'New Selfie' : 'Take a selfie'}
          </Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <TextInput
          style={styles.input}
          placeholder="Visitor's name"
          value={visitorName}
          onChangeText={setVisitorName}
        />
        <TextInput
          style={styles.input}
          placeholder="Responsible official"
          value={selectedEmployee}
          onChangeText={setSelectedEmployee}
        />
        <TextInput
          style={styles.input}
          placeholder="Reason for visit"
          value={reason}
          onChangeText={setReason}
        />

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveCheckIn} style={styles.saveButton}>
            <Text style={styles.buttonText}>Salve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#CCC', padding: 10, borderRadius: 8,
    marginBottom: 12,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cameraButtonText: { color: '#FFF', fontWeight: '600' },
  image: { width: '100%', height: 200, marginBottom: 12, borderRadius: 8 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
});
