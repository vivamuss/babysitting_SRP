import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Asset } from 'expo-asset';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Document {
  id: string;
  name: string;
  type: string;
  uri: string;
  uploadedAt: string;
}

const Profile = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jessica Smith',
    email: 'jessica.smith@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    bio: 'Experienced babysitter with 5+ years of caring for children of all ages. Certified in CPR and First Aid.',
    rate: '$25/hour',
    rating: 4.8,
    reviews: 24,
    isVerified: false,
    documents: [
      {
        id: '1',
        name: 'CPR Certification.pdf',
        type: 'certification',
        uri: 'https://example.com/docs/cpr.pdf',
        uploadedAt: '2023-05-15'
      },
      {
        id: '2',
        name: 'First Aid Certificate.pdf',
        type: 'certification',
        uri: 'https://example.com/docs/firstaid.pdf',
        uploadedAt: '2023-05-15'
      }
    ] as Document[]
  });

  const [editData, setEditData] = useState({ ...profile });

  const handleEdit = () => {
    if (isEditing) {
      // Save changes
      setProfile(editData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleVerificationPress = () => {
    navigation.navigate('babysitterverify');
  };

  const handleDocumentPress = (document: Document) => {
    // Here you would typically open the document or show it in a viewer
    // For now, we'll just log it and you can implement the actual viewer
    console.log('Opening document:', document.uri);
    // navigation.navigate('DocumentViewer', { document });
  };

  const image = Asset.fromModule(require('../assets/images/MomTech_Image.png')).uri;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image source={{ uri: image }} style={styles.profilePicture} />
        <TouchableOpacity style={styles.cameraIcon}>
          <MaterialCommunityIcons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              value={editData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={editData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={editData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={editData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              multiline
            />
            <TextInput
              style={styles.input}
              value={editData.rate}
              onChangeText={(text) => handleInputChange('rate', text)}
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.address}</Text>
            </View>
            <Text style={styles.bio}>{profile.bio}</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="cash" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.rate}</Text>
            </View>
          </>
        )}

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingBox}>
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{profile.rating.toFixed(1)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.reviewsLink}
            onPress={() => navigation.navigate('SettingScreen')}
          >
            <Text style={styles.reviewsText}>{profile.reviews} reviews</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Verification Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification</Text>
        <TouchableOpacity onPress={handleVerificationPress}>
          {profile.isVerified ? (
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#4CAF50" />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            </View>
          ) : (
            <View style={styles.verificationPrompt}>
              <Text style={styles.verificationText}>Get verified to increase your bookings</Text>
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={handleVerificationPress}
              >
                <Text style={styles.verifyButtonText}>Verify Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        {profile.documents.length > 0 ? (
          profile.documents.map((document) => (
            <TouchableOpacity 
              key={document.id}
              style={styles.documentItem}
              onPress={() => handleDocumentPress(document)}
            >
              <MaterialCommunityIcons name="file-document" size={24} color="#666" />
              <Text style={styles.documentText}>{document.name}</Text>
              <Text style={styles.documentDate}>
                {new Date(document.uploadedAt).toLocaleDateString()}
              </Text>
              <MaterialCommunityIcons name="download" size={24} color="#666" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDocumentsText}>No documents uploaded yet</Text>
        )}
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => navigation.navigate('babysitterverify')}
        >
          <Text style={styles.uploadButtonText}>Upload New Document</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Button */}
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => navigation.navigate('SettingScreen')}
      >
        <Text style={styles.settingsButtonText}>Account Settings</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#333',
  },
  editButton: {
    fontSize: 16,
    color: '#3A7D5E',
    fontWeight: '500',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    right: 100,
    bottom: 0,
    backgroundColor: '#3A7D5E',
    borderRadius: 20,
    padding: 8,
  },
  profileInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  reviewsLink: {
    paddingVertical: 6,
  },
  reviewsText: {
    fontSize: 14,
    color: '#3A7D5E',
    textDecorationLine: 'underline',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    alignItems: 'center',
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  verificationPrompt: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#3A7D5E',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  documentText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 12,
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  noDocumentsText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#3A7D5E',
    fontWeight: '500',
  },
  settingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingsButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default Profile;