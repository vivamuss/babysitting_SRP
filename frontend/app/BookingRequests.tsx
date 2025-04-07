
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBabysitterBookings, updateBookingStatus } from './api/api';

const colors = {
  primary: "#6d28d9",
  secondary: "#4A5BD7",
  background: "#F5F7FA",
  card: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#5E6E82",
  success: "#28A745",
  danger: "#DC3545",
  warning: "#FFC107",
  accent: "#E8910E",
  border: "#E2E8F0"
};

const BookingRequests = () => {
  const babysitterId = '65a1b2c3d4e5f67890123457';
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setRefreshing(true);
      const response = await getBabysitterBookings(babysitterId);
      setBookings(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdate = async (id, status) => {
    setIsLoading(true);
    try {
      await updateBookingStatus(id, status);
      Alert.alert('Success', `Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      Alert.alert('Error', `Failed to ${status} booking`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.bookingDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
          <Text style={styles.familyName}>{item.familyName}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="clock" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText}>{item.time}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="human-male-child" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText}>{item.numberOfChildren} {item.numberOfChildren === 1 ? 'child' : 'children'}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="home" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText} numberOfLines={2}>{item.address}</Text>
      </View>

      {item.specialInstructions && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="note" size={20} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.specialInstructions}</Text>
        </View>
      )}

      <View style={styles.bookingStatusContainer}>
        <Text style={[
          styles.bookingStatus,
          { 
            color: item.status === 'confirmed' ? colors.success : 
                   item.status === 'rejected' ? colors.danger : 
                   item.status === 'completed' ? colors.primary : colors.warning 
          }
        ]}>
          {item.status?.toUpperCase() || 'PENDING'}
        </Text>
      </View>

      {item.status === 'completed' && item.rating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating: </Text>
          {[...Array(5)].map((_, i) => (
            <MaterialCommunityIcons 
              key={i} 
              name={i < item.rating ? "star" : "star-outline"} 
              size={20} 
              color={colors.accent} 
            />
          ))}
          {item.review && <Text style={styles.reviewText}>{item.review}</Text>}
        </View>
      )}

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => handleUpdate(item._id, 'confirmed')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleUpdate(item._id, 'rejected')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="notebook" size={32} color={colors.primary} />
        <Text style={styles.title}>Booking Requests</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={fetchBookings}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="notebook-remove" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No booking requests found</Text>
          </View>
        }
      />
    </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: 24,
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  bookingStatusContainer: {
    marginBottom: 12,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 4,
    width: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.card,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default BookingRequests;