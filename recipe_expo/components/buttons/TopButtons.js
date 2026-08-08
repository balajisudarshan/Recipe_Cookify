import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { shareRecipe } from "../../utils/HandleShare";

const { width, height } = Dimensions.get("window");

const REASONS = [
  { value: "INAPPROPRIATE", label: "Inappropriate", icon: "alert-circle-outline" },
  { value: "SPAM", label: "Spam", icon: "megaphone-outline" },
  { value: "COPYRIGHT", label: "Copyright", icon: "document-text-outline" },
  { value: "MISLEADING", label: "Misleading", icon: "warning-outline" },
  { value: "DANGEROUS", label: "Dangerous", icon: "skull-outline" },
  { value: "OTHER", label: "Other", icon: "help-circle-outline" },
];

const RecipeTopActions = ({ onBack, onShare, onMore, recipe }) => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setSelected(null);
    setDescription("");
  };

  const handleSubmit = () => {
    // TODO: wire up API call with { reason: selected, description }
    handleClose();
  };

  return (
    <>
      {/* ── Top bar ── */}
      <View style={styles.container}>
        <TouchableOpacity style={styles.circleBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={width * 0.06} color="#FF7A00" />
        </TouchableOpacity>

        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => shareRecipe(recipe)}>
            <Ionicons name="share-social-outline" size={width * 0.055} color="#FF7A00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="flag-outline" size={width * 0.055} color="#FF7A00" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={handleClose} />

          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Report Recipe</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSub}>What's wrong with this recipe?</Text>

            {/* reason chips */}
            <View style={styles.chipGrid}>
              {REASONS.map((r) => {
                const active = selected === r.value;
                return (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelected(r.value)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={r.icon}
                      size={14}
                      color={active ? "#7A4F00" : "#999"}
                      style={{ marginRight: 5 }}
                    />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* description box */}
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Describe the issue (optional)"
                placeholderTextColor="#C4AA80"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{description.length} / 300</Text>
            </View>

            {/* submit */}
            <TouchableOpacity
              style={[styles.submitBtn, !selected && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!selected}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default RecipeTopActions;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.04,
    right: width * 0.04,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },

  rightActions: {
    flexDirection: "row",
    gap: width * 0.03,
  },

  circleBtn: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Modal ──────────────────────────────────────
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  sheet: {
    backgroundColor: "#FFFEF7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: width * 0.055,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#EDD97A",
  },

  handle: {
    width: 36,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#DFC96A",
    alignSelf: "center",
    marginBottom: 18,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: width * 0.048,
    fontWeight: "700",
    color: "#2E2000",
    letterSpacing: 0.1,
  },
  sheetSub: {
    fontSize: width * 0.034,
    color: "#A07830",
    marginBottom: 16,
  },

  // ── Chips ──────────────────────────────────────
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0D0A0",
    backgroundColor: "#FDFAF0",
  },
  chipActive: {
    backgroundColor: "#FDE87A",
    borderColor: "#C9A800",
  },
  chipText: {
    fontSize: width * 0.033,
    color: "#999",
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#7A4F00",
    fontWeight: "600",
  },

  // ── Description input ──────────────────────────
  inputWrap: {
    borderWidth: 1,
    borderColor: "#E0D0A0",
    borderRadius: 12,
    backgroundColor: "#FDFAF0",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    marginBottom: 20,
  },
  input: {
    fontSize: width * 0.036,
    color: "#3A2800",
    minHeight: 70,
    lineHeight: width * 0.053,
  },
  charCount: {
    fontSize: width * 0.028,
    color: "#C4AA80",
    textAlign: "right",
    marginTop: 4,
  },

  // ── Submit ─────────────────────────────────────
  submitBtn: {
    backgroundColor: "#F5C842",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#B89000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: "#F0E4A0",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    fontSize: width * 0.04,
    fontWeight: "700",
    color: "#3A2400",
    letterSpacing: 0.2,
  },
});