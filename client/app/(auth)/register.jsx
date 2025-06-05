// This will be the first page any user sees when they click on the app
import {Text, StyleSheet,Pressable, Image, TextInput} from 'react-native'
import {Link} from 'expo-router'
import { useRouter } from 'expo-router';
import {Colors} from '@/constants/Colors'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';



// Themed Components
import ThemedView from '@/components/ThemedView'
import ThemedLogo from '@/components/ThemedLogo'
import Spacer from '@/components/Spacer'
import ThemedText  from '@/components/ThemedText'
import ThemedTextInput from '@/components/ThemedTextInput'
import ThemedButton from '@/components/ThemedButton'

const router = useRouter();
const baseUrl = 'https://ka-ching.onrender.com'; 


const Register = () => {
  const [registrationError, setRegistrationError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values,actions) => {
      const vals = {...values}
      actions.resetForm();
      fetch(`${baseUrl}/auth/register`,{
        method: 'POST',
        credentials : 'include',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(vals),
      }).then(async (res) => {
        const data = await res.json();
  
        if (!res.ok || res.status >= 400) {
          console.log('Registration failed', res.status);
          setRegistrationError(data.status || 'Try again');
          return;
        }
  
        if (data.loggedIn) {
          setRegistrationError(''); // Clear any previous error
          router.push('/(tabs)/home');
        } else {
          setRegistrationError(data.status || 'Try again');
        }
      })
      .catch((err) => {
        console.log('Registration failed:', err);
        setRegistrationError('Registration error. Please try again later.');
      });
    },
  });


  return (
    <ThemedView style = {styles.container}>
      <ThemedLogo style={{ alignSelf: 'center' }} />
      <Spacer />
      <ThemedText title = {true} style = {styles.title}>
        Create an account
      </ThemedText>

      
      <ThemedTextInput
        style={{ width: '80%', marginBottom: 5 }}
        placeholder="Email address"
        keyboardType="email-address"
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email && (
        <ThemedText style={{ color: 'red' }}>{formik.errors.email}</ThemedText>
      )}

      <ThemedTextInput
        style={{ width: '80%', marginBottom: 5 }}
        placeholder="Password"
        secureTextEntry
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password && (
        <ThemedText style={{ color: 'red' }}>{formik.errors.password}</ThemedText>
      )}

      {registrationError !== '' && (
        <ThemedText style={{ color: 'red', marginBottom: 10 }}>
          {registrationError}
        </ThemedText>
      )}

      <ThemedButton onPress={formik.handleSubmit} style={{ width: '80%' }}>
        <ThemedText style={{ color: 'white', alignSelf: 'center' }}> Continue </ThemedText>
      </ThemedButton>
    

    <Spacer height = {100} />

    
    <Link href = "/t&c">
      <ThemedText style={{ textAlign: 'center', margin: 30, fontSize: 9 }}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </ThemedText>
    </Link> 

    </ThemedView>


    
  )
}

export default Register

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
