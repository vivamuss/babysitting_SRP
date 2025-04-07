import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Professional color palette
const colors = {
  primary: "#6d28d9",       // Sophisticated green
  secondary: "#4A5BD7",     // Deep blue
  background: "#F5F7FA",    // Light gray background
  card: "#FFFFFF",          // Pure white cards
  textPrimary: "#1A1A1A",   // True black for text
  textSecondary: "#5E6E82", // Gray text
  emergency: "#DC2626",     // Vibrant red for emergencies
  accent: "#E8910E",        // Warm accent color
  border: "#E2E8F0"         // Subtle border color
};

const EmergencyProtocolsScreen = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const resources = [
    { 
      name: "Infant CPR Training", 
      link: "https://www.youtube.com/watch?v=WRZs3R7pXk0",
      icon: "heart-pulse" 
    },
    { 
      name: "Childproofing Guide", 
      link: "https://www.healthychildren.org/English/safety-prevention/at-home/Pages/Childproofing-Your-Home.aspx",
      icon: "home" 
    },
    { 
      name: "Poison Control", 
      link: "https://www.poison.org",
      icon: "bottle-tonic" 
    },
    { 
      name: "Babysitting Training", 
      link: "https://www.redcross.org/take-a-class/babysitting",
      icon: "school" 
    },
    { 
      name: "Allergy Management", 
      link: "https://www.foodallergy.org/resources/babysitters-and-caregivers",
      icon: "allergy" 
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header with emergency icon */}
        <View style={styles.headerContainer}>
          <MaterialCommunityIcons name="alert-octagon" size={32} color={colors.emergency} />
          <Text style={styles.header}>Emergency Protocols</Text>
        </View>

        {/* Emergency Guidelines Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="medical-bag" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Emergency Guidelines</Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <MaterialCommunityIcons name="alert" size={18} color={colors.emergency} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Choking Emergency:</Text>
              {"\n"}• Infants: 5 back blows between shoulder blades
              {"\n"}• Toddlers: Heimlich maneuver
              {"\n"}• Call 108 if persists
            </Text>
          </View>

          <View style={styles.guidelineItem}>
            <MaterialCommunityIcons name="allergy" size={18} color={colors.emergency} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>Allergic Reaction:</Text>
              {"\n"}• Administer EpiPen immediately
              {"\n"}• Call 108 even after medication
            </Text>
          </View>

          <View style={styles.guidelineItem}>
            <MaterialCommunityIcons name="thermometer" size={18} color={colors.emergency} />
            <Text style={styles.guidelineText}>
              <Text style={styles.bold}>High Fever (103°F+):</Text>
              {"\n"}• Administer fever reducer
              {"\n"}• Cool compresses
              {"\n"}• Seek emergency care if unresponsive
            </Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.emergency }]}
            onPress={() => Linking.openURL("tel:108")}
          >
            <MaterialCommunityIcons name="phone" size={24} color="white" />
            <Text style={styles.quickActionText}>Emergency Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.secondary }]}
            onPress={() => Linking.openURL("tel:1234567890")}
          >
            <MaterialCommunityIcons name="account" size={24} color="white" />
            <Text style={styles.quickActionText}>Primary Parent</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.accent }]}
            onPress={() => Linking.openURL("tel:18002221222")}
          >
            <MaterialCommunityIcons name="medical-bag" size={24} color="white" />
            <Text style={styles.quickActionText}>Poison Control</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Protocols Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Safety Protocols</Text>
          </View>
          
          <View style={styles.protocolItem}>
            <MaterialCommunityIcons name="first-aid-kit" size={18} color={colors.primary} />
            <Text style={styles.protocolText}>Complete first aid kit including child-specific medications</Text>
          </View>

          <View style={styles.protocolItem}>
            <MaterialCommunityIcons name="home" size={18} color={colors.primary} />
            <Text style={styles.protocolText}>Childproof environment (outlet covers, cabinet locks)</Text>
          </View>

          <View style={styles.protocolItem}>
            <MaterialCommunityIcons name="exit-run" size={18} color={colors.primary} />
            <Text style={styles.protocolText}>Identify two exit routes from each room</Text>
          </View>
        </View>

        {/* Resources Section */}
        <Text style={styles.sectionTitle}>Safety Resources</Text>
        <View style={styles.resourcesContainer}>
          {resources.map((resource, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.resourceCard}
              onPress={() => Linking.openURL(resource.link)}
            >
              <MaterialCommunityIcons name={resource.icon} size={20} color={colors.primary} />
              <Text style={styles.resourceText}>{resource.name}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginLeft: 12,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: colors.textPrimary,
  },
  guidelineItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  guidelineText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  protocolItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  protocolText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  bold: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickActionButton: {
    width: "30%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  quickActionText: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  resourcesContainer: {
    marginBottom: 40,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resourceText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 12,
    marginRight: 8,
    flex: 1,
  },
});

export default EmergencyProtocolsScreen;