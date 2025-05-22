import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SettingsScreen = () => {
  const [checkIns, setCheckIns] = useState([]);

  const loadData = async () => {
    const json = await AsyncStorage.getItem('checkin_records');
    const data = json ? JSON.parse(json) : [];
    setCheckIns(data.reverse());
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.avatar} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>Name: {item.name}</Text>
        <Text>Employee: {item.employee}</Text>
        <Text>Reason: {item.reason}</Text>
        <Text>Time: {new Date(item.checkInTime).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in History</Text>
      <FlatList
        data={checkIns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No check-ins yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, 
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#777' },
});

export default SettingsScreen;
