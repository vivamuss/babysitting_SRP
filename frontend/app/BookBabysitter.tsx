
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { bookBabysitter } from './api/api';

const colors = {
  primary: "#6d28d9",
  secondary: "#4A5BD7",
  background: "#F5F7FA",
  card: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#5E6E82",
  accent: "#E8910E",
  border: "#E2E8F0"
};

const BookBabysitter = () => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        familyName: '',
        numberOfChildren: '1',
        address: '',
        specialInstructions: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const momId = '65a1b2c3d4e5f67890123456'; 
    const babysitterId = '65a1b2c3d4e5f67890123457';

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBooking = async () => {
        const { date, time, familyName, numberOfChildren, address } = formData;
        
        if (!date || !time || !familyName || !numberOfChildren || !address) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (isNaN(parseInt(numberOfChildren)) || parseInt(numberOfChildren) < 1) {
            Alert.alert('Error', 'Please enter a valid number of children');
            return;
        }

        setIsLoading(true);
        try {
            await bookBabysitter(
                momId, 
                babysitterId, 
                date, 
                time,
                familyName,
                parseInt(numberOfChildren),
                address,
                formData.specialInstructions
            );
            Alert.alert('Success', 'Booking request sent successfully!');
            setFormData({
                date: '',
                time: '',
                familyName: '',
                numberOfChildren: '1',
                address: '',
                specialInstructions: ''
            });
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to send booking request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="account-child" size={32} color={colors.primary} />
                <Text style={styles.title}>Book a Babysitter</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Date (YYYY-MM-DD)*</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="calendar" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="2023-12-31"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.date}
                        onChangeText={(text) => handleChange('date', text)}
                        style={styles.input}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>

                <Text style={styles.label}>Time (HH:MM 24h)*</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="clock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="18:30"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.time}
                        onChangeText={(text) => handleChange('time', text)}
                        style={styles.input}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>

                <Text style={styles.label}>Family Name*</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="Smith Family"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.familyName}
                        onChangeText={(text) => handleChange('familyName', text)}
                        style={styles.input}
                    />
                </View>

                <Text style={styles.label}>Number of Children*</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="human-male-child" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="2"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.numberOfChildren}
                        onChangeText={(text) => handleChange('numberOfChildren', text)}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Address*</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="home" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="123 Main St, City"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.address}
                        onChangeText={(text) => handleChange('address', text)}
                        style={styles.input}
                        multiline
                    />
                </View>

                <Text style={styles.label}>Special Instructions</Text>
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="note" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        placeholder="Any allergies or special needs?"
                        placeholderTextColor={colors.textSecondary}
                        value={formData.specialInstructions}
                        onChangeText={(text) => handleChange('specialInstructions', text)}
                        style={[styles.input, { height: 80 }]}
                        multiline
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleBooking}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Processing...' : 'Confirm Booking'}
                    </Text>
                    <MaterialCommunityIcons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information" size={20} color={colors.secondary} />
                <Text style={styles.infoText}>Your booking will be confirmed within 24 hours</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 12,
        color: colors.textPrimary,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: colors.textPrimary,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderLeftWidth: 3,
        borderLeftColor: colors.secondary,
        padding: 16,
        marginTop: 24,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 8,
        flex: 1,
    },
});

export default BookBabysitter;