import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const MomReviewForm = () => {
  const [formData, setFormData] = useState({
    momName: '',
    question1: '',
    question2: '',
    question3: '',
    rating: 5,
    reviewText: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: number) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = async () => {
    if (!formData.momName || !formData.reviewText) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', formData);
      Alert.alert('Success', 'Thank you for your review!');
      // Reset form
      setFormData({
        momName: '',
        question1: '',
        question2: '',
        question3: '',
        rating: 5,
        reviewText: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            onPress={() => handleRatingChange(star)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={formData.rating >= star ? 'star' : 'star-outline'} 
              size={32} 
              color={formData.rating >= star ? '#FFD700' : '#CCCCCC'} 
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Rate Your Babysitter</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={formData.momName}
          onChangeText={(text) => handleChange('momName', text)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Overall Rating</Text>
        {renderStarRating()}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Was the babysitter punctual?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your answer"
          value={formData.question1}
          onChangeText={(text) => handleChange('question1', text)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Was your child happy?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your answer"
          value={formData.question2}
          onChangeText={(text) => handleChange('question2', text)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Would you hire again?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your answer"
          value={formData.question3}
          onChangeText={(text) => handleChange('question3', text)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          placeholder="Share your experience..."
          value={formData.reviewText}
          onChangeText={(text) => handleChange('reviewText', text)}
        />
      </View>

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d28d9',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#6d28d9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MomReviewForm;