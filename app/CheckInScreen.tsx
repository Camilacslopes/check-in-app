import CheckInFormModal from '@/components/CheckInFormModal';
import EditCheckInModal from '@/components/EditCheckInModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CheckInScreen() {
  interface CheckInRecord {
    id: number;
    name: string;
    employee: string;
    reason: string;
    checkInTime: string;
    checkOutTime?: string;
    selfieUri: string;
  }
  
  const [data, setData] = useState<CheckInRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CheckInRecord | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);


  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem('checkin_records');
      const records = json ? JSON.parse(json) : [];
      setData(records.reverse());
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleChange = (record: CheckInRecord) => {
    setSelectedRecord(record);
    setEditModalVisible(true);
  };
  
  const handleCheckOut = async (id: number) => {
    try {
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, checkOutTime: new Date().toISOString() } : item
      );
      setData(updatedData);
      await AsyncStorage.setItem('checkin_records', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to update check-out:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In</Text>

      <TouchableOpacity style={styles.checkInButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.checkInText}>New Check-In</Text>
      </TouchableOpacity>

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>Name</Text>
        <Text style={[styles.cell, styles.headerCell]}>Check In</Text>
        <Text style={[styles.cell, styles.headerCell]}>Check Out</Text>
        <Text style={styles.actionsHeader}>Actions</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{new Date(item.checkInTime).toLocaleTimeString()}</Text>
            <Text style={styles.cell}>
              {item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '---'}
            </Text>
            <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={() => handleChange(item)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
              {!item.checkOutTime && (
                <TouchableOpacity style={styles.checkoutButton} onPress={() => handleCheckOut(item.id)}>
                  <Text style={styles.checkoutText}>Check-out</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      <CheckInFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={loadData}
      />

      {selectedRecord && (
        <EditCheckInModal
          visible={editModalVisible}
          checkIn={selectedRecord}
          onClose={() => setEditModalVisible(false)}
          onSave={async (updated) => {
            const updatedList = data.map((item) =>
              item.id === updated.id ? updated : item
            );
            setData(updatedList);
            await AsyncStorage.setItem('checkin_records', JSON.stringify(updatedList));
            setEditModalVisible(false);
          }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  checkInButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  checkInText: { color: '#FFF', fontWeight: 'bold' },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
  },
  row: { flexDirection: 'row', marginBottom: 8 },
  cell: { flex: 1 },
  headerCell: { fontWeight: 'bold' },
  actionsHeader: { flex: 1.5, fontWeight: 'bold' },
  actions: { flex: 1.5, flexDirection: 'row', gap: 6 },
  editButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editText: { color: '#000' },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
  },
  checkoutText: { color: '#FFF' },
});
