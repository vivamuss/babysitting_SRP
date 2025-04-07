import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Asset } from 'expo-asset';
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

const HelpScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  // Local knowledge base data
  const knowledgeBase = [
    {
      id: 1,
      question: "How do I hire a babysitter?",
      answer: "1. Go to the 'Find Babysitters' tab\n2. Browse profiles\n3. View ratings and reviews\n4. Tap 'Request Booking'\n5. Confirm details with the sitter",
    },
    {
      id: 2,
      question: "What payment methods are accepted?",
      answer: "We accept:\n- Credit/Debit cards\n- PayPal\n- Apple Pay\n- Google Pay\n\nAll payments are processed securely.",
    },
    {
      id: 3,
      question: "How are babysitters vetted?",
      answer: "All sitters complete:\n✔ Background checks\n✔ Identity verification\n✔ Reference checks\n✔ Interview process\n✔ Safety training",
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: "Babysitting Basics",
      content: "Essential skills every parent and sitter should know",
      videoUrl: "https://www.youtube.com/watch?v=THLZNRf-fj8",
    },
    {
      id: 2,
      title: "Child Safety Tips",
      content: "Creating a safe environment for children",
      videoUrl: "https://www.youtube.com/watch?v=U1S1b_gjZXs",
    },
  ];

  const resources = [
    {
      id: 1,
      title: "Child Care Guidelines",
      url: "https://www.care.com/c/stories/16867/what-does-a-babysitter-do/",
      icon: "web",
    },
    {
      id: 2,
      title: "Parenting Resources",
      url: "https://www.healthychildren.org",
      icon: "book-open",
    },
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const filteredKB = knowledgeBase.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const image = Asset.fromModule(require('../assets/images/MomTech_Image.png')).uri;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="help-circle" size={32} color={colors.primary} />
        <Text style={styles.header}>Help Center</Text>
      </View>

      {/* Search Knowledge Base */}
      <View style={styles.section}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search help articles..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Knowledge Base Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.primary} />
          <Text style={styles.sectionHeader}>Knowledge Base</Text>
        </View>
        
        {filteredKB.length > 0 ? (
          filteredKB.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.faqItem}
              onPress={() => toggleAccordion(item.id)}
              activeOpacity={0.8}
            >
              <View style={styles.faqQuestionContainer}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <MaterialCommunityIcons 
                  name={activeAccordion === item.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </View>
              {activeAccordion === item.id && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>No results found for "{searchQuery}"</Text>
        )}
      </View>

      {/* Tutorials Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialCommunityIcons name="video" size={24} color={colors.primary} />
          <Text style={styles.sectionHeader}>Video Guides</Text>
        </View>
        
        {tutorials.map((tutorial) => (
          <View key={tutorial.id} style={styles.tutorialCard}>
            <Image source={{ uri: image }} style={styles.tutorialImage} />
            <View style={styles.tutorialContent}>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <Text style={styles.tutorialDescription}>{tutorial.content}</Text>
              <TouchableOpacity 
                style={styles.videoButton}
                onPress={() => Linking.openURL(tutorial.videoUrl)}
              >
                <MaterialCommunityIcons name="play-circle" size={20} color={colors.secondary} />
                <Text style={styles.videoButtonText}>Watch Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Resources Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialCommunityIcons name="book" size={24} color={colors.primary} />
          <Text style={styles.sectionHeader}>Helpful Resources</Text>
        </View>
        
        {resources.map((resource) => (
          <View key={resource.id} style={styles.resourceCard}>
            <MaterialCommunityIcons 
              name={resource.icon} 
              size={24} 
              color={colors.secondary} 
            />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(resource.url)}>
                <Text style={styles.resourceLink}>Visit Resource</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={styles.emergencyCard}>
          <MaterialCommunityIcons name="alert" size={24} color={colors.card} />
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
            <TouchableOpacity onPress={() => Linking.openURL("tel:911")}>
              <Text style={styles.emergencyLink}>Call Emergency Services</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 12,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 32,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 12,
    color: colors.textPrimary,
  },
  noResults: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 20,
  },
  faqItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  faqQuestionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 12,
    lineHeight: 22,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  tutorialCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tutorialImage: {
    width: "100%",
    height: 180,
  },
  tutorialContent: {
    padding: 16,
  },
  tutorialTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 22,
  },
  videoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoButtonText: {
    color: colors.secondary,
    fontWeight: "600",
    marginLeft: 8,
  },
  resourceCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resourceTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  resourceLink: {
    color: colors.secondary,
    fontSize: 14,
  },
  emergencyCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  emergencyTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.card,
    marginBottom: 4,
  },
  emergencyLink: {
    color: colors.card,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default HelpScreen;