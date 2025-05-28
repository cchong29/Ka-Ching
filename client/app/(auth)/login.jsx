// This will be the first page any user sees when they click on the app
import {Text, StyleSheet,Pressable, Image, TextInput, View, TouchableOpacity, T } from 'react-native'
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
import ThemedLogo from '@/components/ThemedLogo'


const Login = ({promptAsync}) => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handleSubmit = ()=>{
    console.log('Login form submitted',email,password)
  }

  return (
    <ThemedView style = {styles.container}>
      <ThemedLogo source = {kachinglogo} style = {{alignSelf:'center'}}/>
      <Spacer />

      <ThemedTextInput 
      style = {{width : '80%',marginBottom : 20}}
      placeholder = 'Email address'
      keyboardType = 'email-address'
      onChangeText = {setEmail}
      value = {email}
      />

      <ThemedTextInput 
      style = {{width : '80%',marginBottom : 20}}
      placeholder = 'Password'
      onChangeText = {setPassword}
      value = {password}
      secureTextEntry
      />

      <View style = {{width : '80%', alignItems : 'flex-end'}}>
      <Link href='/'>
      <ThemedText> Forgot Password?</ThemedText>
      </Link>
      </View>

    <ThemedButton onPress = {handleSubmit} style = {{width : '80%'}}>
      <ThemedText style = {{color : 'white', alignSelf : 'center'}}> Log In </ThemedText>
    </ThemedButton>

    
    <ThemedText>or</ThemedText>

    <TouchableOpacity 
    
    onPress={promptAsync}>
        <ThemedText>
            Continue with Google
        </ThemedText>

    </TouchableOpacity>

    <Spacer height = {100} />

    <ThemedText style = {{textAlign : 'center',margin : 30, fontSize : 9}}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
    </ThemedText> 

    <Link href='/register'>
    <ThemedText style = {{textAlign: 'center'}}>
      Don't have an account? Sign up
    </ThemedText>
    </Link>  

    </ThemedView>


    
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems : 'center',
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
