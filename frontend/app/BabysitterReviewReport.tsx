import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
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
}

const BabysitterReviewReport = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
    mostCommonAnswers: {
      question1: '',
      question2: '',
      question3: ''
    }
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        setReviews(res.data);
        computeStats(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const computeStats = (data: Review[]) => {
    if (data.length === 0) return;

    // Calculate average rating
    const totalRating = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avgRating = parseFloat((totalRating / data.length).toFixed(1));
    setAverageRating(avgRating);

    // Calculate rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0];
    data.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating - 1]++;
      }
    });

    // Calculate most common answers
    const computeMostCommonAnswer = (answers: string[]) => {
      const freq: Record<string, number> = {};
      answers.forEach(ans => {
        if (ans) {
          freq[ans] = (freq[ans] || 0) + 1;
        }
      });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : 'No answers yet';
    };

    setStats({
      totalReviews: data.length,
      ratingDistribution,
      mostCommonAnswers: {
        question1: computeMostCommonAnswer(data.map(r => r.question1)),
        question2: computeMostCommonAnswer(data.map(r => r.question2)),
        question3: computeMostCommonAnswer(data.map(r => r.question3))
      }
    });
  };

  const renderRatingBar = (stars: number, count: number) => {
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
    return (
      <View style={styles.ratingBarContainer}>
        <View style={styles.ratingStars}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < stars ? 'star' : 'star-outline'}
              size={16}
              color={i < stars ? '#FFD700' : '#CCCCCC'}
            />
          ))}
        </View>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.ratingCount}>{count}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading report...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Review Analytics Report</Text>
      
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{stats.totalReviews}</Text>
          <Text style={styles.summaryLabel}>Total Reviews</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{averageRating}</Text>
          <Text style={styles.summaryLabel}>Avg Rating</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.round(averageRating) ? 'star' : 'star-outline'}
                size={16}
                color={i < Math.round(averageRating) ? '#FFD700' : '#CCCCCC'}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Rating Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating Distribution</Text>
        {[5, 4, 3, 2, 1].map((stars) => (
          renderRatingBar(stars, stats.ratingDistribution[stars - 1])
        ))}
      </View>

      {/* Common Answers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most Common Answers</Text>
        <View style={styles.answerCard}>
          <Text style={styles.question}>Was the babysitter punctual?</Text>
          <Text style={styles.answer}>{stats.mostCommonAnswers.question1}</Text>
        </View>
        <View style={styles.answerCard}>
          <Text style={styles.question}>Was your child happy?</Text>
          <Text style={styles.answer}>{stats.mostCommonAnswers.question2}</Text>
        </View>
        <View style={styles.answerCard}>
          <Text style={styles.question}>Would you hire again?</Text>
          <Text style={styles.answer}>{stats.mostCommonAnswers.question3}</Text>
        </View>
      </View>

      {/* Recent Reviews */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {reviews.length > 0 ? (
          <FlatList
            data={reviews.slice(0, 3)}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewerName}>{item.momName}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < item.rating ? 'star' : 'star-outline'}
                      size={16}
                      color={i < item.rating ? '#FFD700' : '#CCCCCC'}
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{item.reviewText}</Text>
              </View>
            )}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No reviews yet</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d28d9',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStars: {
    width: 80,
    flexDirection: 'row',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#6d28d9',
    borderRadius: 4,
  },
  ratingCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
  answerCard: {
    backgroundColor: '#f8f5ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6d28d9',
    marginBottom: 4,
  },
  answer: {
    fontSize: 15,
    color: '#555',
  },
  reviewCard: {
    backgroundColor: '#f8f5ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 16,
  },
});

export default BabysitterReviewReport;