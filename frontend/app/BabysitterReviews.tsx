import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Review {
  _id: string;
  momName: string;
  question1: string;
  question2: string;
  question3: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  profilePicture?: string;
}

const BabysitterReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={rating >= star ? 'star' : 'star-outline'}
            size={16}
            color={rating >= star ? '#FFD700' : '#CCCCCC'}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        {item.profilePicture ? (
          <Image 
            source={{ uri: item.profilePicture }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.momName?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{item.momName}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
      </View>
      
      <Text style={styles.reviewText}>{item.reviewText}</Text>
      
      <View style={styles.questionsContainer}>
        <View style={styles.questionItem}>
          <Text style={styles.questionLabel}>Punctuality:</Text>
          <Text style={styles.questionAnswer}>{item.question1}</Text>
        </View>
        <View style={styles.questionItem}>
          <Text style={styles.questionLabel}>Child Happiness:</Text>
          <Text style={styles.questionAnswer}>{item.question2}</Text>
        </View>
        <View style={styles.questionItem}>
          <Text style={styles.questionLabel}>Would Hire Again:</Text>
          <Text style={styles.questionAnswer}>{item.question3}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Babysitter Reviews</Text>
        <Text style={styles.reviewCount}>
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </Text>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbox-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No reviews yet</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  reviewCount: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6d28d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#999',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  questionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  questionLabel: {
    width: 120,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  questionAnswer: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default BabysitterReviews;