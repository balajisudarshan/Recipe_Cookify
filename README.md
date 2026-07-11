# Cookify Recipe App - Complete Implementation Documentation

## Project Overview
Cookify is a React Native recipe sharing application with backend API for recipe management, user profiles, and dietary filtering.

---

## Dietary Categories System

### Backend Enum Values
The backend defines dietary types as uppercase enum values in Prisma schema:
- `VEGAN` - Plant-based recipes with no animal products
- `VEGETARIAN` - Recipes with no meat (includes eggs and dairy)
- `EGGETARIAN` - Vegetarian recipes that include eggs
- `NON_VEG` - Recipes with meat, poultry, or seafood

### Frontend Display Labels
The frontend displays dietary categories with user-friendly labels:
- `Veg` → Maps to `VEGETARIAN`
- `Vegan` → Maps to `VEGAN`
- `Eggetarian` → Maps to `EGGETARIAN`
- `Non Veg` → Maps to `NON_VEG`
- `All` → No filter (all recipes regardless of dietary type)

### Frontend Constants
All dietary type mappings and options are defined in:
```
recipe_expo/const/DIETARY_TYPES.js
```

This file exports:
- `DIETARY_TYPE_MAP` - Maps display labels to backend enum values
- `DIETARY_LABELS` - Display labels for UI
- `ENUM_TO_LABEL` - Reverse mapping from enum to label
- `DIETARY_OPTIONS` - Picker options for recipe creation
- `MEAL_TYPE_OPTIONS` - Breakfast, Lunch, Dinner, Snack
- `COURSE_TYPE_OPTIONS` - Appetizer, Main Course, Side Dish, etc.

---

## Recipe Creation Flow

### AddRecipePage Component
Located at: `recipe_expo/pages/AddRecipePage.js`

#### Form Fields
1. **Recipe Title** - Required text input
2. **Description** - Required multi-line text input
3. **Image** - Required image upload
4. **Ingredients** - Dynamic array with quantity fields
5. **Preparation Steps** - Dynamic array of instructions
6. **Course** - Dropdown selector (APPETIZER, MAIN_COURSE, etc.)
7. **Cuisine** - Dropdown selector (Indian, Italian, etc.)
8. **Meal Type** - Dropdown selector (BREAKFAST, LUNCH, DINNER, SNACK)
9. **Dietary Type** - Radio button selector using valid enum values

#### Dietary Type Validation
- Initial state: `VEGETARIAN` (valid enum value)
- Available options: `VEGAN`, `VEGETARIAN`, `EGGETARIAN`, `NON_VEG`
- Values are sent directly to backend without transformation
- Form validation ensures dietary type is selected before submission

#### API Integration
- Uses `createRecipe()` from `recipe_expo/api/apiRoute.js`
- Submits FormData with multipart/form-data content type
- Automatically formats image URI with proper MIME type

---

## Recipe Filtering System

### HomeScreen Dietary Category Chips
Located at: `recipe_expo/pages/HomeScreen.js`

The HomeScreen displays category chips that filter recipes by dietary type:

```jsx
<CategoryChip
  title="Veg"
  active={category === "Veg"}
  onPress={() => setCategory("Veg")}
/>
```

When a category is selected:
1. The `category` state is updated with the display label
2. The label is mapped to the backend enum value via `DIETARY_TYPE_MAP`
3. The mapped enum value is passed to `RecentRecipes` component

### RecentRecipes Component Filter
Located at: `recipe_expo/components/RecentRecipes.js`

The component accepts a `dietaryType` prop and passes it to the API:

```jsx
const recipes = await getRecentRecipes(dietaryType);
```

When `dietaryType` changes (category selection changes):
- useEffect dependency array includes `dietaryType`
- Component automatically re-fetches recipes with the new filter
- Loading state manages UI feedback during fetch

### API Query Parameters
Updated in: `recipe_expo/api/apiRoute.js`

Both functions now support optional `dietaryType` parameter:

```javascript
export const getAllRecipes = (dietaryType = null) => {
  if (dietaryType) {
    return api.get('/recipe', { params: { dietaryType } });
  }
  return api.get('/recipe');
}

export const getRecentRecipes = (dietaryType = null) => {
  if (dietaryType) {
    return api.get('/recipe/recent', { params: { dietaryType } });
  }
  return api.get('/recipe/recent');
}
```

---

## UI Component Enhancements

### RecipeCard Component
Located at: `recipe_expo/components/cards/RecipeCard.js`

**Dietary Icon Rendering:**
- VEGAN → Sprout icon (#16A34A)
- VEGETARIAN → Leaf icon (#22C55E)
- EGGETARIAN → Egg icon (#F59E0B)
- NON_VEG → Drumstick icon (#EF4444)
- Unknown/null → Help circle icon (#999999)

**Defensive Rendering:**
- Dietary badge only renders if `recipe.dietaryType` has a value
- Switch statement handles unrecognized values gracefully
- Fallback icon and color for invalid types

### InfoChip Component
Located at: `recipe_expo/components/chips/InfoChip.js`

**Features:**
- Supports type: "course", "cuisine", "meal", "dietary"
- Returns null if label is undefined/null (graceful fallback)
- Each type has custom icon and color scheme
- Dietary types use uppercase enum values

**Dietary Type Handling:**
- Validates label against known enum values
- Default case returns help circle icon for unrecognized types
- Replaces underscores in display labels (e.g., "NON_VEG" → "NON VEG")

---

## Backend API Endpoints

### Recipe Endpoints
- `GET /api/recipe` - Get all recipes (supports ?dietaryType query param)
- `GET /api/recipe/recent` - Get recent recipes (supports ?dietaryType query param)
- `GET /api/recipe/:id` - Get single recipe
- `POST /api/recipe/create` - Create new recipe
- `GET /api/recipe/my` - Get user's recipes
- `GET /api/recipe/liked` - Get user's favorite recipes
- `PUT /api/recipe/like/:id` - Toggle recipe like status

### Query Parameters
All recipe listing endpoints support:
- `dietaryType` - Filter by dietary type (VEGAN, VEGETARIAN, EGGETARIAN, NON_VEG)

Example: `GET /api/recipe?dietaryType=VEGAN`

---

## Data Flow Diagram

```
HomeScreen (category state)
    ↓
    ├─ setCategory("Veg")
    ↓
    ├─ DIETARY_TYPE_MAP["Veg"] → "VEGETARIAN"
    ↓
    ├─ Pass to RecentRecipes(dietaryType="VEGETARIAN")
    ↓
    ├─ RecentRecipes useEffect triggered
    ↓
    ├─ getRecentRecipes("VEGETARIAN")
    ↓
    ├─ api.get('/recipe/recent', { params: { dietaryType: "VEGETARIAN" } })
    ↓
    ├─ Backend filters recipes
    ↓
    └─ Display filtered recipes with dietary icons
```

---

## Form Submission Flow (AddRecipePage)

```
1. User fills form with valid enum value from DIETARY_OPTIONS
2. handleSubmit validates all required fields
3. FormData created with:
   - title, description, course, cuisine, mealType
   - dietaryType (already valid enum, no transformation)
   - ingredients (JSON array)
   - steps (JSON array)
   - image (multipart blob with MIME type)
4. createRecipe() POST to /api/recipe/create
5. Backend stores recipe with valid dietary enum
6. Form resets on success
```

---

## Files Modified/Created

### New Files
- `recipe_expo/const/DIETARY_TYPES.js` - Centralized constants

### Modified Files
- `recipe_expo/pages/AddRecipePage.js` - Fixed enum initialization and validation
- `recipe_expo/pages/HomeScreen.js` - Added dietary filtering to RecentRecipes
- `recipe_expo/api/apiRoute.js` - Added query parameter support
- `recipe_expo/components/RecentRecipes.js` - Added dietaryType prop and useEffect dependency
- `recipe_expo/components/cards/RecipeCard.js` - Added defensive dietary icon rendering
- `recipe_expo/components/chips/InfoChip.js` - Added null checks and default case

---

## Testing Checklist

- [ ] AddRecipePage initializes with VEGETARIAN (not "Veg")
- [ ] Recipe submission sends valid enum value to backend
- [ ] HomeScreen category chips update RecentRecipes
- [ ] Selecting "Veg" fetches VEGETARIAN recipes only
- [ ] Selecting "All" fetches all recipes
- [ ] RecipeCard displays correct dietary icons
- [ ] RecipeCard handles null dietary type gracefully
- [ ] InfoChip returns null for null label
- [ ] API calls include dietaryType query parameter when filtering

---

## Future Enhancements

1. Add meal type filtering (BREAKFAST, LUNCH, DINNER, SNACK)
2. Add course type filtering (APPETIZER, MAIN_COURSE, etc.)
3. Combine multiple filters (dietaryType + mealType + cuisine)
4. Add search functionality with filter combination
5. Add save/bookmark recipes feature
6. Add recipe rating and review system
7. Add recipe editing capability
