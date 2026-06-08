import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ScreenHeader from '../components/ScreenHeader'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
const ProfileScreen = () => {
  const {user,setUser,setToken} = useAuth()
  console.log(user)
  const handleLogout = async()=>{
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")

      setUser(null)
      setToken(null)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View>
      <ScreenHeader title="Profile"/>
      <Text>{user.username}</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>LogOut</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default ProfileScreen