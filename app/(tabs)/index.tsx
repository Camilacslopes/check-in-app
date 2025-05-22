import { router } from 'expo-router';
import { Button, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ padding: 20 }}>
      <Button title="Start" onPress={() => router.push('/check-in')} />
      <Button title="Purge" onPress={() => router.push('/purge')} />
      <Button title="Settings" onPress={() => router.push('/settings')} />
    </View>
  );
}
