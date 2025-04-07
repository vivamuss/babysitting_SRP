import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Types for our data
type Booking = {
  id: string;
  familyName: string;
  initials: string;
  avatarColor: string;
  textColor: string;
  date: string;
  time: string;
  children: string;
  status: string;
  location: string;
};

type Review = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  textColor: string;
  date: string;
  rating: number;
  text: string;
};

const BabySitterDashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName);
  };

  // Mock function to fetch bookings - replace with your actual data fetching
  const fetchBookings = async () => {
    // In a real app, you would fetch this from your backend or context
    const mockBookings: Booking[] = [
      {
        id: '1',
        familyName: 'Robinson Family',
        initials: 'JR',
        avatarColor: '#fce7f3',
        textColor: '#ec4899',
        date: 'Today, June 15',
        time: '6:00 PM - 9:00 PM',
        children: '2 children (ages 3 and 5)',
        status: 'Confirmed',
        location: '1234 Park Avenue'
      },
      {
        id: '2',
        familyName: 'Thompson Family',
        initials: 'MT',
        avatarColor: '#dbeafe',
        textColor: '#3b82f6',
        date: 'Tomorrow, June 16',
        time: '3:00 PM - 6:00 PM',
        children: '1 child (age 4)',
        status: 'Confirmed',
        location: '5678 Lake Street'
      }
    ];
    return mockBookings;
  };

  // Mock function to fetch reviews - replace with your actual data fetching
  const fetchReviews = async () => {
    // In a real app, you would fetch this from your backend or context
    const mockReviews: Review[] = [
      {
        id: '1',
        name: 'Emma Thompson',
        initials: 'ET',
        avatarColor: '#fce7f3',
        textColor: '#ec4899',
        date: '2 days ago',
        rating: 5,
        text: 'Jessica was wonderful with our kids! Very attentive and engaging. We will definitely book her again.'
      },
      {
        id: '2',
        name: 'Michael Roberts',
        initials: 'MR',
        avatarColor: '#dbeafe',
        textColor: '#3b82f6',
        date: '1 week ago',
        rating: 5,
        text: 'Jessica is amazing! She took great care of our children and we felt very comfortable leaving them with her.'
      }
    ];
    return mockReviews;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [bookings, reviews] = await Promise.all([
          fetchBookings(),
          fetchReviews()
        ]);
        setUpcomingBookings(bookings);
        setRecentReviews(reviews);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BabySitter</Text>
        <View style={styles.navContainer}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('BabySitterDashboard')}
          >
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('Availability')}
          >
            <Text style={styles.navText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('BookingRequests')}
          >
            <Text style={styles.navText}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('BabysitterReviews')}
          >
            <Text style={styles.navText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('Profile')}
          >
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('EmergencyProtocolsScreen')}
          >
            <Text style={styles.navText}>Emergency Protocols</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('SettingScreen')}
          >
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigateTo('HelpScreen')}
          >
            <Text style={styles.navText}>Help</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Switch to Parent</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: '#3b82f6' }]}>JS</Text>
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome back, Jessica!</Text>
        <Text style={styles.welcomeSubtitle}>
          You have {upcomingBookings.length} upcoming {upcomingBookings.length === 1 ? 'booking' : 'bookings'} for this week
        </Text>
        <TouchableOpacity 
          style={styles.availabilityButton}
          onPress={() => navigateTo('Availability')}
        >
          <Text style={styles.availabilityButtonText}>Update Availability</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Earnings Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f3e8ff' }]}>
            <MaterialIcons name="attach-money" size={20} color="#9333ea" />
          </View>
          <Text style={styles.statLabel}>This Month Earnings</Text>
          <Text style={styles.statValue}>$1,235.00</Text>
          <TouchableOpacity onPress={() => navigateTo('PaymentCenter')}>
            <Text style={styles.statLink}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Bookings Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
            <FontAwesome name="users" size={18} color="#3b82f6" />
          </View>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statValue}>12</Text>
          <TouchableOpacity onPress={() => navigateTo('BookingRequests')}>
            <Text style={styles.statLink}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Jobs Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
            <MaterialIcons name="date-range" size={18} color="#22c55e" />
          </View>
          <Text style={styles.statLabel}>Upcoming Jobs</Text>
          <Text style={styles.statValue}>{upcomingBookings.length}</Text>
          <TouchableOpacity onPress={() => navigateTo('BookingStatus')}>
            <Text style={styles.statLink}>View schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Rating Card */}
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fef9c3' }]}>
            <FontAwesome name="star" size={18} color="#eab308" />
          </View>
          <Text style={styles.statLabel}>Ratings</Text>
          <Text style={styles.statValue}>
            {recentReviews.length > 0 ? 
              (recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length).toFixed(1) : 
              '0.0'}
          </Text>
          <TouchableOpacity onPress={() => navigateTo('BabysitterReviewReport')}>
            <Text style={styles.statLink}>View Ratings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Upcoming Bookings */}
        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={[styles.bookingAvatar, { backgroundColor: booking.avatarColor }]}>
                    <Text style={[styles.bookingAvatarText, { color: booking.textColor }]}>{booking.initials}</Text>
                  </View>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingFamily}>{booking.familyName}</Text>
                    <Text style={styles.bookingTime}>{booking.date} • {booking.time}</Text>
                    <Text style={styles.bookingDetails}>{booking.children}</Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingStatus}>{booking.status}</Text>
                  <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={16} color="#6b7280" />
                    <Text style={styles.bookingLocation}>{booking.location}</Text>
                  </View>
                </View>
                <View style={styles.bookingActions}>
                  <TouchableOpacity style={styles.bookingButton} onPress={() => navigateTo('HelpScreen')}>
                    <Text style={styles.bookingButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.bookingButton}
                    onPress={() => navigateTo('BookingStatus', { bookingId: booking.id })}
                  >
                    <Text style={styles.bookingButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming bookings</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigateTo('Availability')}
              >
                <Text style={styles.emptyStateButtonText}>Update your availability</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          
          {recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.reviewAvatar, { backgroundColor: review.avatarColor }]}>
                    <Text style={[styles.reviewAvatarText, { color: review.textColor }]}>{review.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome 
                      key={i} 
                      name="star" 
                      size={16} 
                      color={i < review.rating ? '#f59e0b' : '#d1d5db'} 
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No reviews yet</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => navigateTo('BabysitterReviews')}
              >
                <Text style={styles.emptyStateButtonText}>View all reviews</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  navContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  navItem: {
    marginHorizontal: 8,
  },
  navText: {
    color: '#6b7280',
    fontSize: 14,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  switchButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  availabilityButton: {
    backgroundColor: '#1f2937',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  availabilityButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statLink: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '500',
  },
  mainContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  bookingsSection: {
    width: '100%',
    marginBottom: 16,
  },
  reviewsSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bookingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingAvatarText: {
    fontWeight: 'bold',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingFamily: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookingTime: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  bookingDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
  },
  bookingStatus: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  bookingButtonText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewAvatarText: {
    fontWeight: 'bold',
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#9333ea',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default BabySitterDashboard;