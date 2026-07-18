import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const ViewAllRecipesScreen = () => {
  const route = useRoute()
  const { category } = route.params || {}

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>View {category || 'All'} Recipes</Text>
      <Text style={styles.subtitle}>
        Browse every recipe in the {category ? `${category.toLowerCase()} category` : 'collection'} and discover something delicious.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    maxWidth: '90%',
  },
})

export default ViewAllRecipesScreen