import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import ScreenWrapper from "../components/ScreenWrapper";
import { Picker } from "@react-native-picker/picker";
import RadioGroup from "../components/RadioGroup";
import * as ImagePicker from "expo-image-picker";
import { createRecipe } from "../api/apiRoute";
const { width } = Dimensions.get("window");

const AddRecipePage = () => {
  // Main form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("Veg");
  const [selectedMealType,setSelectedMealType] = useState("")

  // Arrays handle their own lengths now—no extra row counts needed!
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const courseOptions = [
    { label: "APPETIZER", value: "APPETIZER" },
    { label: "Main Course", value: "MAIN_COURSE" },
    { label: "Side Dish", value: "SIDE_DISH" },
    { label: "Dessert", value: "DESSERT" },
    { label: "Beverage", value: "BEVERAGE" },
    { label: "Soup", value: "SOUP" },
  ];
  const mealTypes = [
    {label:"BreakFast",value:"BREAKFAST"}, 
    {label:"Lunch",value:"LUNCH"}, 
    {label:"Dinner",value:"DINNER"}, 
    {label:"Snack",value:"SNACK"},
  ];
  const Cuisine = [
    { label: "Indian", value: "INDIAN" },
    { label: "South Indian", value: "SOUTH_INDIAN" },
    { label: "North Indian", value: "NORTH_INDIAN" },
    { label: "Italian", value: "ITALIAN" },
    { label: "Chinese", value: "CHINESE" },
    { label: "Mexican", value: "MEXICAN" },
    { label: "Continental", value: "CONTINENTAL" },
    { label: "Thai", value: "THAI" },
    { label: "American", value: "AMERICAN" },
    { label: "Japanese", value: "JAPANESE" },
    { label: "Mediterranean", value: "MEDITERRANEAN" },
    { label: "Middle Eastern", value: "MIDDLE_EASTERN" },
    { label: "Spanish", value: "SPANISH" },
    { label: "French", value: "FRENCH" },
  ];

  const dietaryType = ["VEGAN", "VEGETARIAN", "EGGETARIAN", "NON_VEG"];
  //   VEGAN
  // VEGETARIAN
  // EGGETARIAN
  // NON_VEG

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Saves the local file link to state
    }
  };

  // Core update Handlers
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredient = [...ingredients];
    updatedIngredient[index][field] = value;
    setIngredients(updatedIngredient);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value; // Fixed to handle plain string arrays cleanly
    setSteps(newSteps);
  };

  // Row modifier logic
  const addIngredientRow = () =>
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  const removeIngredientRow = () => setIngredients(ingredients.slice(0, -1));

  const addStepRow = () => setSteps([...steps, ""]);
  const removeStepRow = () => setSteps(steps.slice(0, -1));

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !selectedCourse ||
      !selectedCuisine ||
      !selectedMealType||
      !image
    ) {
      alert("Please fill out all fields and upload an image!");
      return;
    }
    // const data = {
    //   title: title.trim(),
    //   description: description.trim(),
    //   image: image,
    //   ingredients: ingredients,
    //   steps: steps,
    //   course: selectedCourse,
    //   cuisine: selectedCuisine,
    //   dietaryType: selectedDiet,
    // };
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("course", selectedCourse);
      formData.append("cuisine", selectedCuisine);
      formData.append("mealType",selectedMealType)
      formData.append("dietaryType", selectedDiet.toUpperCase());

      formData.append(
        "ingredients",
        JSON.stringify(ingredients.filter((i) => i.name.trim() !== "")),
      );
      formData.append(
        "steps",
        JSON.stringify(steps.filter((s) => s.trim() !== "")),
      );

      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: image,
        name: filename,
        type: type,
      });

      const response = await createRecipe(formData);
      if (response.status === 201 || response.status === 200) {
        alert("🎉 Recipe uploaded successfully!");
        setTitle("");
        setDescription("");
        setImage(null);
        setIngredients([{ name: "", quantity: "" }]);
        setSteps([""]);
      }
    } catch (error) {
      console.error(
        "Axios Recipe Upload Error:",
        error.response?.data || error.message,
      );
      alert(`Upload failed: ${error.response?.data?.error || "Network error"}`);
    } finally {
      setLoading(false);
    }
    // console.log("Submitting Recipe Draft Matrix:", data);
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Curve Header */}
        <View style={[styles.curveView, { backgroundColor: "#FF7A00" }]}>
          <View style={styles.headerContent}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Add Recipe</Text>
              <Text style={styles.subtitle}>
                Share Your Recipe to the World
              </Text>
            </View>
          </View>
        </View>

        {/* Central Layout Body Container */}
        <View style={styles.addRecipeContainer}>
          {/* Upload Media Area */}
          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            {image ? (
              <>
                {console.log(image)}
                <Image source={{ uri: image }} style={styles.previewImage} />
              </>
            ) : (
              <>
                <View style={styles.iconCircle}>
                  <Feather name="camera" size={28} color="#FF7A00" />
                </View>
                <Text style={styles.uploadText}>Upload Recipe Image</Text>
                <Text style={styles.uploadSubtext}>Max size 5MB</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Recipe Title Field */}
          <View style={styles.col}>
            <Text style={styles.inputTxt}>Recipe Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g Spicy Lentil Soup"
              placeholderTextColor="#A0AEC0"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Recipe Description Area Box Field */}
          <View style={styles.col}>
            <Text style={styles.inputTxt}>Recipe Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. A rich and spicy lentil soup perfect for winter nights..."
              placeholderTextColor="#A0AEC0"
              multiline={true}
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Dynamic Matrix Rows Section: Ingredients & Quantities */}
          <View style={styles.col}>
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.inputTxt}>Ingredients</Text>
                {ingredients.map((item, index) => (
                  <TextInput
                    key={`ing-${index}`}
                    style={styles.input}
                    placeholder={`Ingredient ${index + 1}`}
                    placeholderTextColor="#A0AEC0"
                    value={item.name}
                    onChangeText={(text) =>
                      handleIngredientChange(index, "name", text)
                    }
                  />
                ))}
              </View>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.inputTxt}>Quantity</Text>
                {ingredients.map((item, index) => (
                  <TextInput
                    key={`qty-${index}`}
                    style={styles.input}
                    placeholder="e.g. 5 Cups"
                    placeholderTextColor="#A0AEC0"
                    value={item.quantity}
                    onChangeText={(text) =>
                      handleIngredientChange(index, "quantity", text)
                    }
                  />
                ))}
              </View>
            </View>

            {/* Ingredient Action Buttons */}
            <View style={styles.buttonActionRow}>
              <TouchableOpacity
                style={styles.addRowBtn}
                onPress={addIngredientRow}
              >
                <Text style={styles.addRowTxt}>Add Row</Text>
              </TouchableOpacity>

              {ingredients.length > 1 && (
                <TouchableOpacity
                  style={styles.removeRowBtn}
                  onPress={removeIngredientRow}
                >
                  <Text style={styles.removeRowTxt}>Remove Row</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Dynamic Preparation Sequential Steps Module */}
          <View style={styles.col}>
            <Text style={styles.inputTxt}>Preparation Steps</Text>
            <View style={{ gap: 10 }}>
              {steps.map((step, index) => (
                <TextInput
                  key={`step-${index}`}
                  style={styles.input}
                  placeholder={`Enter step ${index + 1}`}
                  placeholderTextColor="#A0AEC0"
                  value={step}
                  onChangeText={(text) => handleStepChange(index, text)}
                />
              ))}
            </View>

            {/* Steps Action Buttons */}
            <View style={styles.buttonActionRow}>
              <TouchableOpacity style={styles.addRowBtn} onPress={addStepRow}>
                <Text style={styles.addRowTxt}>Add Row</Text>
              </TouchableOpacity>

              {steps.length > 1 && (
                <TouchableOpacity
                  style={styles.removeRowBtn}
                  onPress={removeStepRow}
                >
                  <Text style={styles.removeRowTxt}>Remove Row</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Dropdown System Pickers Row */}
          <View style={{ flexDirection: "row", gap: 16, marginTop: 5 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputTxt}>Select Course</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemVal) => setSelectedCourse(itemVal)}
                  dropdownIconColor="#FF7A00"
                  mode="dropdown"
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Course..." value="" color="#A0AEC0" />
                  {courseOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="#2D3748"
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.inputTxt}>Select Cuisine</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCuisine}
                  onValueChange={(itemVal) => setSelectedCuisine(itemVal)}
                  dropdownIconColor="#FF7A00"
                  mode="dropdown"
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Cuisine..." value="" color="#A0AEC0" />
                  {Cuisine.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="#2D3748"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          <View >
              <Text style={styles.inputTxt}>Select MealType</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedMealType}
                  onValueChange={(itemVal) => setSelectedMealType(itemVal)}
                  dropdownIconColor="#FF7A00"
                  mode="dropdown"
                  style={styles.pickerStyle}
                >
                  <Picker.Item label="Meal Type..." value="" color="#A0AEC0" />
                  {mealTypes.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color="#2D3748"
                    />
                  ))}
                </Picker>
              </View>
            </View>

          {/* Radio Group Selector Component */}
          <View style={{ marginTop: 5, flexWrap: "wrap" }}>
            <RadioGroup
              label="Dietary Type"
              options={dietaryType}
              selectedValue={selectedDiet}
              onSelect={setSelectedDiet}
            />
          </View>

          {/* Draft Actions Control Row */}
          <View style={[styles.row, { marginBottom: 35, marginTop: 15 }]}>
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.disabledBtn]} // Dims the button visually when loading
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={loading} // 👈 Disables all touch triggers while loading is active
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" /> // 👈 Shows spinning wheel
              ) : (
                <Text style={styles.primaryBtnTxt}>Add Recipe</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.discardBtn} activeOpacity={0.8}>
              <Text style={styles.removeRowTxt}>Discard Draft</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbfe" },
  curveView: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: { flex: 1, paddingRight: width * 0.25 },
  title: { color: "#FFFFFF", fontSize: width * 0.085, fontWeight: "800" },
  subtitle: { color: "#FFE5D0", fontSize: width * 0.04, marginTop: 8 },
  addRecipeContainer: {
    flex: 1,
    backgroundColor: "#fffbfe",
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  uploadBox: {
    height: 140,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FF7A00",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#FFF5EC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    overflow: "hidden",
  },
  previewImage: {
    position: "absolute", // 👈 2. ADD THIS: Forces the image to break free from centering
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFE0C2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  uploadText: { fontSize: 16, fontWeight: "600", color: "#FF7A00" },
  uploadSubtext: { fontSize: 12, color: "#FCA5A5", marginTop: 4 },
  col: { flexDirection: "column", gap: 6 },
  row: { flexDirection: "row", gap: 16 },
  buttonActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  input: {
    borderColor: "#00000028",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: "#FFF",
    fontSize: 15,
    color: "#2D3748",
  },
  textArea: {
    height: 95,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  inputTxt: {
    paddingLeft: 4,
    fontWeight: "bold",
    fontSize: 15,
    color: "#4A5568",
  },
  addRowBtn: {
    flex: 2,
    backgroundColor: "#FFF5EC",
    padding: 12,
    borderWidth: 2,
    borderColor: "#FF7A00",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
    padding: 12,
    borderWidth: 2,
    borderColor: "#ff0000",
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeRowTxt: {
    textAlign: "center",
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 15,
  },
  pickerWrapper: {
    borderColor: "#00000028",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#FFF",
    height: 48,
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 4,
  },
  pickerStyle: { width: "100%", color: "#2D3748" },
  primaryBtn: {
    flex: 1.3,
    backgroundColor: "#FF7A00",
    padding: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryBtnTxt: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  discardBtn: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddRecipePage;
