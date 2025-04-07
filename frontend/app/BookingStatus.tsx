import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBabysitterBookings } from './api/api';

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

const BookingStatus = () => {
  const babysitterId = '65a1b2c3d4e5f67890123457';
  const [bookings, setBookings] = useState([]);
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

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.familyName}>{item.familyName}</Text>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
        <Text style={styles.detailText}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="clock" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText}>{item.time}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="human-male-child" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText}>
          {item.numberOfChildren} {item.numberOfChildren === 1 ? 'child' : 'children'}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="home" size={20} color={colors.textSecondary} />
        <Text style={styles.detailText}>{item.address}</Text>
      </View>

      {item.specialInstructions && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="note" size={20} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.specialInstructions}</Text>
        </View>
      )}

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[
          styles.statusText,
          { color: item.status === 'confirmed' ? colors.success :
                   item.status === 'rejected' ? colors.danger :
                   item.status === 'completed' ? colors.primary : colors.warning }
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Booking Status</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderBookingItem}
        refreshing={refreshing}
        onRefresh={fetchBookings}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-alert" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No bookings available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
  emptyState: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default BookingStatus;
