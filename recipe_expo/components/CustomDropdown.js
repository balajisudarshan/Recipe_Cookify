import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const CustomDropdown = ({
  label,
  placeholder = "Select...",
  options = [],
  selectedValue,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdownButton}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedOption && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="#FF7A00" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{label || placeholder}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="x" size={22} color="#4A5568" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={options}
                  keyExtractor={(item, index) => item.value ? item.value.toString() : index.toString()}
                  showsVerticalScrollIndicator={true}
                  style={styles.optionsList}
                  renderItem={({ item }) => {
                    const isSelected = item.value === selectedValue;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          isSelected && styles.selectedOptionItem,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => {
                          onSelect(item.value);
                          setModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Feather name="check" size={18} color="#FF7A00" />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    paddingLeft: 4,
    fontWeight: "bold",
    fontSize: 15,
    color: "#4A5568",
    marginBottom: 4,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#00000028",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    height: 48,
    paddingHorizontal: 16,
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#2D3748",
    fontWeight: "500",
    flex: 1,
  },
  placeholderText: {
    color: "#A0AEC0",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxHeight: "60%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3748",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 2,
  },
  selectedOptionItem: {
    backgroundColor: "#FFF5EC",
  },
  optionText: {
    fontSize: 15,
    color: "#2D3748",
    fontWeight: "400",
  },
  selectedOptionText: {
    color: "#FF7A00",
    fontWeight: "700",
  },
});

export default CustomDropdown;
