import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'

const app = () => {
  return (
    <View style = {styles.container}>
      <Text style = {styles.title}>Ka-Ching!</Text>
      <Link href = "/explore" style = {styles.link} > Explore </Link>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexDirection : 'column',
  },
  title:{
    color : 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign : 'center',
  },
  link:{
    color : 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign : 'center',
    textDecorationLine : 'underline',
    padding : 4,
  }
})