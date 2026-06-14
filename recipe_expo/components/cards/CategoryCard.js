import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function CategoryCard({ title, backgroundColor, borderColor, Icon, onPress }) {
  return (
    <TouchableOpacity 
      style={[
        styles.cardContainer, 
        { backgroundColor: backgroundColor, borderColor: borderColor }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrapper}>
        {/* Render the dynamically passed component */}
        <Icon width={32} height={32} />
      </View>
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 95,                 
    height: 90,                
    borderRadius: 16,          
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1.5,
    backgroundColor:"red",
    
    // Smooth shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2, 
  },
  iconWrapper: {
    marginBottom: 6 ,
    
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600", 
    color: "#4A3319",   
  }
});