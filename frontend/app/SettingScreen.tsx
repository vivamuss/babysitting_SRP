import React, { useState, useEffect } from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity, Animated, Easing, StyleSheet } from "react-native";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Elegant and clean color palette
const colors = {
  primary: "#6d28d9",
  secondary: "#5D6BE8",
  background: "#F8FAFC",
  card: "#FFFFFF",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  accent: "#F59E0B",
  border: "#E2E8F0",
  success: "#10B981",
  error: "#EF4444"
};

const SettingsScreen = ({ userId }: { userId: string }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [privacySettings, setPrivacySettings] = useState({
    isProfilePublic: false,
    allowMessagesFromStrangers: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/settings/${userId}`)
      .then((response) => {
        const settings = response.data;
        setNotificationsEnabled(settings.notificationsEnabled);
        setProfileVisibility(settings.profileVisibility);
        setPrivacySettings(settings.privacySettings);
      })
      .catch((error) => console.error("Error fetching user settings:", error));
  }, [userId]);

  const showMessage = (isSuccess: boolean) => {
    if (isSuccess) {
      setSaveSuccess(true);
      setSaveError(false);
    } else {
      setSaveSuccess(false);
      setSaveError(true);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSaveSuccess(false);
      setSaveError(false);
    });
  };

  const updateSettings = () => {
    const settingsData = {
      notificationsEnabled,
      profileVisibility,
      privacySettings,
    };

    axios
      .post(`http://localhost:5000/api/settings/${userId}`, settingsData)
      .then((response) => {
        showMessage(true);
      })
      .catch((error) => {
        showMessage(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Settings & Preferences</Text>

      {/* Animated success or error message */}
      <Animated.View
        style={[
          styles.messageContainer,
          {
            opacity: fadeAnim,
            backgroundColor: saveSuccess ? colors.success : colors.error,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.messageText}>
          {saveSuccess ? "Settings saved successfully!" : "Failed to save settings. Please try again."}
        </Text>
      </Animated.View>

      {/* Profile Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>

        {/* Profile Visibility Radio Buttons */}
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <MaterialCommunityIcons name="account" size={20} color={colors.textSecondary} />
            <Text style={styles.settingTitle}>Profile Visibility</Text>
          </View>
          <View style={styles.radioContainer}>
            {["public", "private"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.radioButton,
                  profileVisibility === option && styles.radioButtonSelected,
                ]}
                onPress={() => setProfileVisibility(option)}
              >
                <Text
                  style={[
                    styles.radioText,
                    profileVisibility === option && styles.radioTextSelected,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggle: Make Profile Public */}
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <MaterialCommunityIcons name="eye" size={20} color={colors.textSecondary} />
            <Text style={styles.settingTitle}>Make Profile Public</Text>
          </View>
          <Switch
            value={privacySettings.isProfilePublic}
            onValueChange={(value) =>
              setPrivacySettings({ ...privacySettings, isProfilePublic: value })
            }
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <MaterialCommunityIcons name="bell" size={20} color={colors.textSecondary} />
            <Text style={styles.settingTitle}>Enable Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Privacy Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <MaterialCommunityIcons name="message" size={20} color={colors.textSecondary} />
            <Text style={styles.settingTitle}>Allow Messages From Strangers</Text>
          </View>
          <Switch
            value={privacySettings.allowMessagesFromStrangers}
            onValueChange={(value) =>
              setPrivacySettings({ ...privacySettings, allowMessagesFromStrangers: value })
            }
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Save Settings Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={updateSettings}
        activeOpacity={0.85}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 32,
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
    paddingLeft: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginLeft: 12,
  },
  radioContainer: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  radioButtonSelected: {
    backgroundColor: colors.primary,
  },
  radioText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  radioTextSelected: {
    color: "#fff",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginRight: 12,
  },
  messageContainer: {
    position: "absolute",
    top: 80,
    left: 24,
    right: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default SettingsScreen;
