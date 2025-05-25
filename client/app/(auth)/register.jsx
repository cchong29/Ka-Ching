// This will be the first page any user sees when they click on the app
import {Text, StyleSheet,Pressable, Image, TextInput } from 'react-native'
import {useState} from 'react'
import {Link} from 'expo-router'
import {Colors} from '@/constants/Colors'

// Themed Components
import ThemedView from '@/components/ThemedView'
import kachinglogo from '@/assets/images/ka-ching-logo.png'
import Spacer from '@/components/Spacer'
import ThemedText  from '@/components/ThemedText'
import ThemedTextInput from '@/components/ThemedTextInput'
import ThemedButton from '@/components/ThemedButton'

const Register = () => {
  const [email,setEmail] = useState('')

  const handleEmail = ()=>{
    console.log('Email submitted',email)
  }

  return (
    <ThemedView style = {styles.container}>
      <Image source = {kachinglogo} style = {{alignSelf:'center'}}/>
      <Spacer />
      <ThemedText title = {true} style = {styles.title}>
        Create an account
      </ThemedText>

      <ThemedText style = {{textAlign : 'center'}}>
        Enter your email to sign up for this app
      </ThemedText>

      <ThemedTextInput 
      style = {{width : '80%',marginBottom : 20}}
      placeholder = 'Email address'
      keyboardType = 'email-address'
      onChangeText = {setEmail}
      value = {email}
      />


    <ThemedButton onPress = {handleEmail}>
      <Text style = {{textAlign : 'center',color : '#137547'}}> Continue </Text>
    </ThemedButton>

    <Spacer height = {100} />

    
    <ThemedText style = {{textAlign : 'center',margin : 30}}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
    </ThemedText>  

    </ThemedView>


    
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  
  title: {
    textAlign: 'center',
    fontSize:18,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  btn : {
    backgroundColor : Colors.primary,
    padding : 15,
    borderRadius : 5,
  },
  pressed : {
    opacity : 0.8
  }
});
