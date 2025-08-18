import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useEffect, useState } from 'react';
import { MealAPI } from '@/services/mealAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { searchStyles } from '@/assets/styles/search.styles';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '@/components/RecipeCard';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query) => {
    // if no search query.
    if (!query.trim()) {
      const randomMeals = await MealAPI.getRandomMeals(12);

      return randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal);
    }

    // search by name first, then by ingredient if no results found.
    const mealsByName = await MealAPI.searchMealsByName(query);
    let results = mealsByName;
    if (results.length === 0) {
      const ingredientResult = await MealAPI.filterByIngredient(query);
      results = ingredientResult;
    }
    return results
      .slice(0, 12)
      .map((meal) => MealAPI.transformMealData(meal))
      .filter((meal) => meal !== null);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch('');
        setRecipes(results);
      } catch (error) {
        console.error('Error loading initial data', error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialLoading) return;

    const handleSearch = async () => {
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error('Error performing search', error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery, initialLoading]);

  if (initialLoading) {
    return <Text>Loading some data...</Text>;
  }

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={searchStyles.searcIcon}
          />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search recipes, ingredients..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={searchStyles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {searchQuery
              ? `Results for "${debouncedSearchQuery}"`
              : 'Popular Recipes'}
          </Text>
          <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>
        {loading ? (
          <View style={searchStyles.loadingContainer}>
            <Text style={searchStyles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NowResultsFound />}
          />
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

function NowResultsFound() {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color={COLORS.textLight} />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try a different search term.
      </Text>
    </View>
  );
}
