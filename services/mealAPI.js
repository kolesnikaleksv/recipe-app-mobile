const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const MealAPI = {
  searchMealsByName: async (name) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error searching meals by name', error);
      return [];
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  getMealById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('Error fetching meal by ID', error);
      return null;
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error('Error fetching random meal', error);
      return null;
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  getRandomMeals: async (count = 6) => {
    try {
      const promises = Array.from({ length: count }, () =>
        MealAPI.getRandomMeal()
      );
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null);
    } catch (error) {
      console.error('Error fetching random meals', error);
      return [];
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories', error);
      return [];
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  filterByIngredient: async (ingredient) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error filtering meals by ingredient', error);
      return [];
    } finally {
      console.log('Fetch attempt completed');
    }
  },
  filterByCategory: async (category) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error filtering meals by category', error);
      return [];
    } finally {
      console.log('Fetch attempt completed');
    }
  },

  transformMealData: (meal) => {
    if (!meal) return null;

    // Extract ingredients and measures, filtering out empty ingredients
    const ingredients = Array.from({ length: 20 }, (_, i) => {
      const ingredient = meal[`strIngredient${i + 1}`]?.trim();
      const measure = meal[`strMeasure${i + 1}`]?.trim();
      if (!ingredient) return null;
      return `${measure ?? ''} ${ingredient}`.trim();
    }).filter(Boolean);

    // Split instructions by new lines and filter out empty steps
    const instructions = meal.strInstructions
      ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strMealDescription
        ? meal.strMealDescription.substring(0, 120) + '...'
        : 'No description available',
      image: meal.strMealThumb,
      cookTime: '30 minutes',
      serving: 4,
      category: meal.strCategory || 'Main Course',
      area: meal.strArea,
      instructions,
      ingredients,
      originalData: meal,
    };
  },
};
