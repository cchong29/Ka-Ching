// This will be the first page any user sees when they click on the app
import {Text, StyleSheet,Pressable, Image, TextInput, View, TouchableOpacity, T } from 'react-native'
import { useRouter } from 'expo-router';
import {Link} from 'expo-router'
import {Colors} from '@/constants/Colors'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react'; 
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useColorScheme } from 'react-native';



// Themed Components
import ThemedView from '@/components/ThemedView'
import Spacer from '@/components/Spacer'
import ThemedText  from '@/components/ThemedText'
import ThemedTextInput from '@/components/ThemedTextInput'
import ThemedButton from '@/components/ThemedButton'
import ThemedLogo from '@/components/ThemedLogo'

const router = useRouter();
const baseUrl = 'https://ka-ching.onrender.com'; 

const Login = ({ promptAsync, isSigningIn }) => {
  const [loginError, setLoginError] = useState('');

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
      actions.resetForm()
      fetch(`${baseUrl}/auth/login`,{
        method: 'POST',
        credentials : 'include',
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(vals),
      }).catch(err=>{
        console.log(err);
        setLoginError('Network error. Please try again.');
        return;
      }).then(res=>{
        if (!res || !res.ok || res.status >=400){
          setLoginError('Something went wrong.');
          return;
        } 
        return res.json();
      }).then(data=>{
        if (data.loggedIn) 
        {
          setLoginError('');
          router.push('/(tabs)/home')
        }
        else {
          setLoginError(data.status || 'Login failed.'); 
        }
      })
    },
  });


  // Test to get data from backend
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseUrl}`, {
        method: 'GET',
        credentials: 'include', // optional unless session is used
      });

      const test = await res.json(); // <- this will be 'hi'
      console.log('Backend response:', test);
      setMessage(test); // will be "hi"
    } catch (err) {
      console.error('Error fetching:', err);
    }
  };


  return (
    <ThemedView style={styles.container}>


    <Pressable onPress={fetchData} style={{ marginVertical: 10 }}>
    <ThemedText style={{ color: 'blue' }}>Tap to fetch from backend</ThemedText>
    </Pressable>

    {message ? (
      <ThemedText style={{ marginTop: 10 }}>Backend says: {message}</ThemedText>
    ) : null}


      <ThemedLogo style={{ alignSelf: 'center' }} />
      <Spacer />

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

      {loginError ? (
        <ThemedText style={{ color: 'red', marginBottom: 10 }}>{loginError}</ThemedText>
      ) : null}


      <View style={{ width: '80%', alignItems: 'flex-end' }}>
        <Link href="/">
          <ThemedText> Forgot Password?</ThemedText>
        </Link>
      </View>

      <ThemedButton onPress={formik.handleSubmit} style={{ width: '80%' }}>
        <ThemedText style={{ color: 'white', alignSelf: 'center' }}> Log In </ThemedText>
      </ThemedButton>

      <ThemedText>or</ThemedText>

      
      <TouchableOpacity
        onPress={promptAsync}
        disabled={isSigningIn}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent : 'center',
          backgroundColor: '#EEEEEE',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          width: '80%',
          marginTop: 10,
        }}
      >
      <Image
        source={require('@/assets/images/google.png')}
        style={{ width: 20, height: 20, marginRight: 12 }}
      />
      <Text style={{ color: '#000', fontWeight: '600' }}>
        {isSigningIn ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>



      <Spacer height={100} />

      <Link href = "/t&c">
      <ThemedText style={{ textAlign: 'center', margin: 30, fontSize: 9 }}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </ThemedText>
      </Link>

      <Link href="/register">
        <ThemedText style={{ textAlign: 'center' }}>
          Don't have an account? Sign up
        </ThemedText>
      </Link>
    </ThemedView>
  );
};

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
