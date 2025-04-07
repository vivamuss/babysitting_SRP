import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState, useEffect } from 'react';

export default function BabysitterVerificationScreen() {
  const [documents, setDocuments] = useState({
    babysitting: null,
    firstAid: null,
    anaphylaxis: null,
    otherDocuments: null, // Optional
  });
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Verification status

  const user_email = "sara@momtech.in";

  // Check verification status on mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await fetch(`http://10.5.183.238:5000/check-verification?email=${user_email}`);
      console.log('Response:', response);
      const result = await response.json();
      if (response.ok && result.verified) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const pickDocument = async (type) => {
    if (isVerified) return;

    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

    if (result.type !== 'cancel' && result.assets && result.assets[0]) {
      const file = result.assets[0];

      setDocuments((prev) => ({
        ...prev,
        [type]: { name: file.name, uri: file.uri },
      }));
    }
  };

  const clearAllDocuments = () => {
    if (isVerified) return;

    setDocuments({
      babysitting: null,
      firstAid: null,
      anaphylaxis: null,
      otherDocuments: null,
    });
  };

  const uploadDocuments = async () => {
    if (isVerified) return;
    if (!documents.babysitting || !documents.firstAid || !documents.anaphylaxis) {
      Alert.alert('Error', 'Please upload all required certificates.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        const originalName = documents[key].name;
        const extension = originalName.split('.').pop();
        const formattedName = `${user_email.replace(/[@.]/g, '')}_${key}.${extension}`;

        formData.append(key, {
          uri: documents[key].uri,
          type: 'application/pdf',
          name: formattedName,
        });
      }
    });

    formData.append('email', user_email);

    try {
      const response = await fetch('http://10.5.183.238:5000/upload', {
        method: 'POST',
        body: formData, // No need to set multipart headers manually
      });

      const result = await response.json();
      if (response.ok) {
        setIsVerified(true);
        Alert.alert('Success', 'Verification successful!');
      } else {
        Alert.alert('Error', result.error || 'Failed to upload documents.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while uploading.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadedCount = Object.values(documents).filter((doc) => doc).length;
  const progress = Math.round((uploadedCount / 3) * 100);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Babysitter Verification</Text>
      <Text style={styles.subHeader}>
        Upload your certificates for verification.{'\n'}Complete the steps below.
      </Text>

      <Text style={styles.progressText}>
        {`Progress: ${uploadedCount}/3 required certificates uploaded (${progress}%)`}
      </Text>

      <View style={styles.uploadSection}>
        {['babysitting', 'firstAid', 'anaphylaxis'].map((key) => (
          <View key={key} style={styles.uploadItem}>
            <View style={styles.uploadRow}>
              <Text style={styles.uploadLabel}>
                {key === 'babysitting' 
                  ? 'Babysitting Course' 
                  : key === 'firstAid' 
                  ? 'First Aid' 
                  : 'Anaphylaxis'} Certificate
              </Text>
              <TouchableOpacity 
                style={[styles.uploadButton, isVerified && styles.disabledButton]} 
                onPress={() => pickDocument(key)}
                disabled={isVerified}
              >
                <MaterialCommunityIcons name="file-upload" size={24} color={isVerified ? '#A1A1AA' : '#7C3AED'} />
                <Text style={[styles.uploadText, isVerified && styles.disabledText]}>
                  {documents[key] ? 'Replace' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
            {documents[key]?.name && <Text style={styles.fileName}>{`Uploaded: ${documents[key].name}`}</Text>}
          </View>
        ))}

        <View style={styles.uploadItem}>
          <View style={styles.uploadRow}>
            <Text style={styles.uploadLabel}>Other Documents (Optional)</Text>
            <TouchableOpacity 
              style={[styles.uploadButton, isVerified && styles.disabledButton]} 
              onPress={() => pickDocument('otherDocuments')}
              disabled={isVerified}
            >
              <MaterialCommunityIcons name="file-upload" size={24} color={isVerified ? '#A1A1AA' : '#7C3AED'} />
              <Text style={[styles.uploadText, isVerified && styles.disabledText]}>
                {documents.otherDocuments ? 'Replace' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
          {documents.otherDocuments?.name && <Text style={styles.fileName}>{`Uploaded: ${documents.otherDocuments.name}`}</Text>}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.clearButton, isVerified && styles.disabledButton]} 
        onPress={clearAllDocuments} 
        disabled={isVerified}
      >
        <Text style={[styles.clearText, isVerified && styles.disabledText]}>Clear All</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, (loading || isVerified) && styles.disabledButton]} 
        onPress={uploadDocuments} 
        disabled={loading || isVerified}
      >
        {loading ? <ActivityIndicator size="small" color="#fff" /> : 
          <Text style={[styles.submitText, isVerified && styles.disabledText]}>
            {isVerified ? 'Verified ✅' : 'Submit for Verification'}
          </Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('https://github.com/balanGH/MomTech/blob/d026784b005341949e7c5012fefda2271a84166f/T%26C.md')}>
        <Text style={styles.termsText}>Terms and Conditions Apply</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  progressText: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 16, fontStyle: 'italic' },
  uploadSection: { marginBottom: 24 },
  uploadItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 },
  uploadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  uploadLabel: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  uploadButton: { flexDirection: 'row', alignItems: 'center' },
  uploadText: { fontSize: 14, color: '#4B5563', marginLeft: 8 },
  fileName: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
  clearButton: { backgroundColor: '#E11D48', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  clearText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  submitButton: { backgroundColor: '#7C3AED', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  termsText: { textAlign: 'center', fontSize: 14, color: '#7C3AED', marginTop: 16, textDecorationLine: 'underline' },
  disabledButton: { backgroundColor: '#D1D5DB' },
  disabledText: { color: '#9CA3AF' },
});
