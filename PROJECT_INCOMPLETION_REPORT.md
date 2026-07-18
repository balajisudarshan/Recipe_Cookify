 # Cookify Recipe App — Incompletion Report

## Overview
This document records the main implementation gaps in the project related to recipe dietary categories, recipe submission, and front-end filtering.

## 1. Dietary Category Support
### What exists
- Backend Prisma schema defines `DietaryType` values:
  - `VEGAN`
  - `VEGETARIAN`
  - `EGGETARIAN`
  - `NON_VEG`
- Recipe model includes `dietaryType` and endpoint `/api/recipe` supports query filter `dietaryType`.

### Incompletions
- `recipe_expo/pages/AddRecipePage.js` uses `selectedDiet` initial value `"Veg"`.
  - the supported enum values are uppercase and the app should use `VEGAN`, `VEGETARIAN`, `EGGETARIAN`, `NON_VEG`.
  - `selectedDiet.toUpperCase()` turns `Veg` into `VEG`, which is not valid for the Prisma enum and may break recipe creation or store invalid values.
- visible dietary category chips in `recipe_expo/pages/HomeScreen.js` are not wired to fetch filtered recipes.
  - The category buttons update state only, but they do not call any API or filter recipe lists by `dietaryType`.
- `recipe_expo/components/RecentRecipes.js` fetches `/recipe/recent` without passing a `dietaryType` query parameter.
- `recipe_expo/components/RecipeCard.js` and `recipe_expo/components/chips/InfoChip.js` use dietary type rendering logic, but they assume valid uppercase values and do not handle invalid or missing values gracefully.

## 2. Frontend Filtering and Category UI
### What exists
- `HomeScreen` contains category chips: `All`, `Veg`, `Vegan`, `Eggetarian`, `Non Veg`.
- `CategoryChip` component displays a chip UI.
- Backend API includes query filters for `/api/recipe` and `/api/recipe/recent`.

### Incompletions
- There is no front-end effect or data fetch that uses the `category` state on `HomeScreen`.
- `HomeScreen` does not call `getAllRecipes` or any recipe listing API to populate results depending on the selected category.
- There is no centralized recipe list page or component that uses `dietaryType`, `mealType`, or `course` query filters in the current front-end code.
- `recipe_expo/api/apiRoute.js` exposes a plain `getAllRecipes()` that always requests `/recipe` with no query options.
- `RecipeOfTheDayCard` toggles a single featured recipe, but it also does not use any dietary filtering even when the app UI supports categories.

## 3. Recipe Creation and Validation
### What exists
- `AddRecipePage` collects title, description, course, cuisine, mealType, dietaryType, ingredients, steps, and image.
- Backend `createRecipe` stores `dietaryType`, `mealType`, and `course` as uppercase values.

### Incompletions
- `AddRecipePage` does not validate `selectedDiet` against the backend enum values.
- There is no validation for `selectedDiet` being required; if the user leaves the field unchanged, the default `"Veg"` is invalid.
- The dietary options list is present but no mapping exists for `Veg` → `VEGETARIAN` or `Non Veg` → `NON_VEG` in the form logic.
- The `createRecipe` back-end endpoint expects correct enum values; the client currently sends values only by calling `toUpperCase()` on UI text, which can create invalid values like `VEG`.

## 4. Backend vs Frontend Enum Mismatch
### What exists
- Backend Prisma enum: `VEGAN`, `VEGETARIAN`, `EGGETARIAN`, `NON_VEG`.
- UI category display strings: `Veg`, `Vegan`, `Eggetarian`, `Non Veg`.

### Incompletions
- UI labels and data values are not normalized consistently.
- There is no mapping layer between display labels and API enum values.
- This creates a gap between what the user sees and what the backend expects.

## 5. Additional Notes
- `recipe_expo/components/RecentRecipes.js` and `recipe_expo/components/cards/RecipeOfTheDayCard.js` load recipes, but the app lacks a consistent recipe listing or search page that uses filters.
- `recipe_expo/components/PopularRecipe.js` appears to reference a hard-coded external endpoint and is not matching the rest of the app’s API style.
- `recipe_expo/pages/SearchScreen.js` is currently a placeholder: the search bar is rendered but no search logic is implemented, and the code that would fetch users is commented out.
- `recipe_expo/hooks/useUsers.js` accepts optional `limit` and `sortBy` parameters but `apiRoute.getUsers()` ignores them, so the user list hook cannot currently request filtered or sorted results.
- The workspace has a root `README.md`, but the app still lacks a dedicated implementation status or feature-gap document for current search and recipe filtering behavior.

## 6. Suggested Fixes
1. Normalize dietary category values in the front end:
   - Use a lookup object for display label → API enum value.
   - Example: `Veg` → `VEGETARIAN`, `Non Veg` → `NON_VEG`, `Vegan` → `VEGAN`, `Eggetarian` → `EGGETARIAN`.
2. Add recipe filter API calls in `HomeScreen`:
   - When category changes, call `/api/recipe?dietaryType=...`.
   - Also support `All` by omitting `dietaryType`.
3. Fix `AddRecipePage` dietary option state:
   - Initialize `selectedDiet` with a valid backend enum value such as `VEGETARIAN` or `VEGAN`.
   - Send the actual enum value directly instead of calling `toUpperCase()` on display text.
4. Update `RecentRecipes` to support optional dietary filter and pass query parameters when needed.
5. Add defensive render fallback for invalid dietary values in `RecipeCard` and `InfoChip`.
6. Add a root README or documentation file describing how dietary categories are intended to work.

## 7. Priority Issues
1. Fix `AddRecipePage` dietary enum mismatch — this can break recipe creation.
2. Wire `HomeScreen` category state to actual API filtering.
3. Normalize frontend labels and backend query values.
4. Add missing recipe list page or category-based recipe display.
5. Add documentation for dietary categories and filter behavior.

## 8. Recommended Implementation Outline
- Create a shared constants file in `recipe_expo/const/` for:
  - `DIETARY_TYPE_MAP`
  - `MEAL_TYPE_OPTIONS`
  - `COURSE_TYPE_OPTIONS`
- Update UI components to use shared constants.
- Implement category filter function in `HomeScreen`.
- Add query parameters to `getAllRecipes` and `getRecentRecipes` in `recipe_expo/api/apiRoute.js`.
- Add form value normalization and validation in `AddRecipePage`.

---

This report is intentionally focused on the dietary/category-related incompletions in the current project state. If you want, I can also extend it to cover general missing features such as search, profile flows, recipe editing, or notification handling.