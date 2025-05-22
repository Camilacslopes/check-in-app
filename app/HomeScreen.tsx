import { RelativePathString, useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In App</Text>
      <Button title="Start" onPress={() => router.push('/check-in' as RelativePathString)} />
      <Button title="Purge" onPress={() => alert('Purge data')} />
      <Button title="Settings" onPress={() => router.push('/settings' as RelativePathString)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});
