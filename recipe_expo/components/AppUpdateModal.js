import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const AppUpdateModal = ({
  visible,
  latestVersion = "1.1.0",
  updateUrl = "https://expo.dev/accounts/balajisudarshan/projects/recipi/builds",
  releaseNotes = "New features, bug fixes, and performance improvements are available in this release.",
  isMandatory = false,
  onClose,
}) => {
  const handleDownload = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl).catch((err) =>
        console.log("Failed to open update URL:", err)
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        if (!isMandatory && onClose) onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="cellphone-arrow-down"
              size={36}
              color="#FF7A00"
            />
          </View>

          <Text style={styles.title}>New App Update Available! 🚀</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version {latestVersion}</Text>
          </View>

          <Text style={styles.description}>
            A new Cookify app version is available. {releaseNotes}
          </Text>

          <TouchableOpacity
            style={styles.downloadBtn}
            activeOpacity={0.8}
            onPress={handleDownload}
          >
            <Feather name="download" size={20} color="#FFFFFF" />
            <Text style={styles.downloadBtnText}>Download & Install Update</Text>
          </TouchableOpacity>

          {!isMandatory && (
            <TouchableOpacity
              style={styles.laterBtn}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.laterBtnText}>Remind Me Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFF3EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  versionBadge: {
    backgroundColor: "#FF7A00",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  versionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF7A00",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#FF7A00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  laterBtn: {
    marginTop: 12,
    paddingVertical: 10,
  },
  laterBtnText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AppUpdateModal;
