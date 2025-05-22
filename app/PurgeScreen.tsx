import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Button, Text, View } from 'react-native';

export default function PurgeScreen() {
  const handlePurge = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to erase all check-in records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, erase all',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('checkin_records');
              Alert.alert('Success', 'All data erased.');
            } catch (error) {
              console.error('Failed to purge data:', error);
              Alert.alert('Error', 'Failed to erase the records.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Purge</Text>
      <Button title="Erase All Records" color="red" onPress={handlePurge} />
    </View>
  );
}
