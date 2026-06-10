import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import React from "react";
import { Feather } from "@expo/vector-icons";
import ScreenWrapper from "../components/ScreenWrapper";
import { useState } from "react";
import {Picker} from "@react-native-picker/picker"


const { width } = Dimensions.get("window");

const AddRecipePage = () => {
  const [ingredientRowCount, setIngredientRowCount] = useState(0);
  const [stepCount, setStepCount] = useState(0);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const courseOptions = [
    { label: "Starter", title: "Starter", value: "STARTER" },
  { label: "Main Dish", title: "Main Dish", value: "MAIN_DISH" },
  { label: "Side Dish", title: "Side Dish", value: "SIDE_DISH" },
  { label: "Dessert", title: "Dessert", value: "DESSERT" },
  { label: "Beverage", title: "Beverage", value: "BEVERAGE" },
  { label: "Snack", title: "Snack", value: "SNACK" },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View
          style={[
            styles.curveView,
            {
              backgroundColor: "#FF7A00",
            },
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Add Recipe</Text>
              <Text style={styles.subtitle}>
                Share Your Recipe to the World
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.addRecipeContainer}>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <Feather name="camera" size={28} color="#FF7A00" />
            </View>
            <Text style={styles.uploadText}>Upload Recipe Image</Text>
            <Text style={styles.uploadSubtext}>Max size 5MB</Text>
          </TouchableOpacity>

          <View style={styles.col}>
            <Text style={styles.inputTxt}>Recipe Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g Spicy Lentil Coup"
            />
          </View>

          <View style={styles.col}>
            <Text style={styles.inputTxt}>Recipe Description</Text>
            <TextInput
              style={[styles.inputBase, styles.textArea]}
              placeholder="e.g. A rich and spicy lentil soup perfect for winter nights..."
              placeholderTextColor="#A0AEC0"
              style={styles.input}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={styles.col}>
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.inputTxt}>Ingredients</Text>
                {Array.from({ length: ingredientRowCount }).map((_, index) => (
                  <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Ingredient ${index + 1}`}
                  />
                ))}
              </View>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.inputTxt}>Quantity {"(e.g 5 Cups)"}</Text>
                {Array.from({ length: ingredientRowCount }).map((_, index) => (
                  <TextInput
                    key={`qty-${index}`}
                    style={styles.input}
                    placeholder={`e.g. 5 Cups`}
                  />
                ))}
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              <TouchableOpacity
                style={styles.addRowBtn}
                onPress={() => setIngredientRowCount(ingredientRowCount + 1)}
              >
                <Text style={styles.addRowTxt}>Add Row</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeRowBtn}
                onPress={() => setIngredientRowCount(ingredientRowCount - 1)}
              >
                <Text style={styles.removeRowTxt}>Remove Row</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.inputTxt}>Preparation Steps</Text>
            {Array.from({ length: stepCount }).map((_, index) => (
              <TextInput
                style={styles.input}
                key={index}
                placeholder={`Enter step ${index}`}
              />
            ))}

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              <TouchableOpacity
                style={styles.addRowBtn}
                onPress={() => setStepCount(stepCount + 1)}
              >
                <Text style={styles.addRowTxt}>Add Row</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeRowBtn}
                onPress={() => setStepCount(stepCount - 1)}
              >
                <Text style={styles.removeRowTxt}>Remove Row</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={styles.inputTxt}>Select Course</Text>
          <View style={styles.pickerWrapper}>
            
           <Picker 
            selectedValue={selectedCourse}
            onValueChange={(itemVal)=>setSelectedCourse(itemVal)}
            dropdownIconColor="#FF7A00"
            mode="dropdown"
            style={styles.pickerStyle}
            
            >
              {courseOptions.map((option)=>(
                
                <Picker.Item 
                    key={option.value} 
                    label={option.label || option.title}
                    value={option.value} 
                    color="#2D3748"
                  />
                  
              ))}
            </Picker>
          </View>
          </View>

        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F2" },
  curveView: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1, paddingRight: width * 0.25 },
  title: { color: "#FFFFFF", fontSize: width * 0.085, fontWeight: "800" },
  subtitle: { color: "#FFE5D0", fontSize: width * 0.04, marginTop: 8 },
  category: {
    color: "#f3f3f3",
  },
  addRecipeContainer: {
    flex: 1,
    backgroundColor: "#fffbfe", // Matches your Profile and Search screens
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 10,
  },

  uploadBox: {
    height: 150,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FF7A00",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#FFF5EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFE0C2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF7A00",
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#FCA5A5", // Faded text for instructions
    marginTop: 4,
  },
  col: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
    // alignItems:"center"
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
  input: {
    borderColor: "#00000028",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    // height:35
  },
  inputTxt: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 15,
  },
  addRowBtn: {
    flex: 2,
    backgroundColor: "#FFF5EC",
    marginTop: 10,
    // textAlign:"center"
    padding: 10,
    // borderRadius:20,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FF7A00",
    borderStyle: "dashed",
    borderRadius: 16,
  },
  addRowTxt: {
    textAlign: "center",
    color: "#FF7A00",
    fontWeight: "bold",
    fontSize: 15,
  },

  removeRowBtn: {
    flex: 1,
    backgroundColor: "#ffbaba",
    marginTop: 10,
    // textAlign:"center"
    padding: 10,
    // borderRadius:20,
    width: "100%",
    borderWidth: 2,
    borderColor: "#ff0000",
    borderStyle: "dashed",
    borderRadius: 16,
  },
  removeRowTxt: {
    textAlign: "center",
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 15,
  },
  pickerStyle:{
    width: "100%",
    color: "#2D3748",
  },
  pickerWrapper:{
    borderColor: "#00000028",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#FFF",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  }
});

export default AddRecipePage;
