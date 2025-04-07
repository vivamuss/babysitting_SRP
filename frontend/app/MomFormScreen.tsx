import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function MomFormScreen({ navigation }) {
  const [form, setForm] = useState({
    familyName: '',
    noOfChildren: '',
    address: '',
    rating: '',
    timing: '',
    date: '',
    babysitterId: '12345', // Hardcoded for demo
    momId: '67890'          // Hardcoded for demo
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/bookings', form);
      navigation.navigate('BabysitterResponse', { bookingId: res.data._id });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Family Name</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, familyName: text})} />
      <Text>No of Children</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(text) => setForm({...form, noOfChildren: text})} />
      <Text>Address</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, address: text})} />
      <Text>Rating</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(text) => setForm({...form, rating: text})} />
      <Text>Timing</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, timing: text})} />
      <Text>Date</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, date: text})} />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 }
});
