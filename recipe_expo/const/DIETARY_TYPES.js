// Dietary Type Mapping - Frontend Labels to Backend Enum Values
export const DIETARY_TYPE_MAP = {
  "Veg": "VEGETARIAN",
  "Vegan": "VEGAN",
  "Eggetarian": "EGGETARIAN",
  "Non Veg": "NON_VEG",
  "All": null, // No filter for all
};

// Display labels for UI
export const DIETARY_LABELS = {
  VEGETARIAN: "Veg",
  VEGAN: "Vegan",
  EGGETARIAN: "Eggetarian",
  NON_VEG: "Non Veg",
};

// Reverse mapping: Backend enum to display label
export const ENUM_TO_LABEL = {
  VEGETARIAN: "Veg",
  VEGAN: "Vegan",
  EGGETARIAN: "Eggetarian",
  NON_VEG: "Non Veg",
};

// Valid dietary types for the picker
export const DIETARY_OPTIONS = [
  { label: "Vegetarian", value: "VEGETARIAN" },
  { label: "Vegan", value: "VEGAN" },
  { label: "Eggetarian", value: "EGGETARIAN" },
  { label: "Non Vegetarian", value: "NON_VEG" },
];

// Meal Type Options
export const MEAL_TYPE_OPTIONS = [
  { label: "Breakfast", value: "BREAKFAST" },
  { label: "Lunch", value: "LUNCH" },
  { label: "Dinner", value: "DINNER" },
  { label: "Snack", value: "SNACK" },
];

// Course Type Options
export const COURSE_TYPE_OPTIONS = [
  { label: "Appetizer", value: "APPETIZER" },
  { label: "Main Course", value: "MAIN_COURSE" },
  { label: "Side Dish", value: "SIDE_DISH" },
  { label: "Dessert", value: "DESSERT" },
  { label: "Beverage", value: "BEVERAGE" },
  { label: "Soup", value: "SOUP" },
];
