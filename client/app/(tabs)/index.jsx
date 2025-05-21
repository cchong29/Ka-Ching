import { View, Text,StyleSheet, ImageBackground,Image } from 'react-native'
import React from 'react'
import kachingImage from "@/assets/images/kachinglogo.png"

const app = () => {
  return (
    <View style = {styles.container}>
      <ImageBackground 
      source = {kachingImage}
      resizeMode='cover'
      style = {styles.image}>
      <Text style = {styles.text} ></Text>
      </ImageBackground>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection: 'column',
  },
  text : {
    color : 'white',
    fontSize : 42,
    fontWeight : 'bold',
    textAlign : 'center',
  },
  image : {
    width: '100%',
    marginTop: 40,
    justifyContent : 'center',
  
  }
})

