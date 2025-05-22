import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditCheckInModal({ visible, onClose, checkIn, onSave }: {
  visible: boolean;
  onClose: () => void;
  checkIn: any;
  onSave: (updated: any) => void;
}) {
  const [name, setName] = useState('');
  const [employee, setEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    if (checkIn) {
      setName(checkIn.name);
      setEmployee(checkIn.employee);
      setReason(checkIn.reason);
      setImageUri(checkIn.imageUri);
    }
  }, [checkIn]);

  const pickImage = async () => {
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

  const handleSave = () => {
    onSave({
      ...checkIn,
      name,
      employee,
      reason,
      imageUri,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Edit Check-In</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Change Selfie</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <TextInput
          style={styles.input}
          placeholder="Visitor's name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Responsible official"
          value={employee}
          onChangeText={setEmployee}
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
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
  imageButton: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  imageButtonText: { color: '#333' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#aaa',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    flex: 1,
  },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
});
