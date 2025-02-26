import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Splash from '../../screens/Splash';
import Login from '../../screens/Login';
import Register from '../../screens/Register';
import Home from '../../screens/Home';
import ForgotPassword from '../../screens/OTP/ForgotPassword';
import VerificationCode from '../../screens/OTP/VerificationCode';
import ResetPassword from "../../screens/OTP/ResetPassword"

const StackNav = () => {
    const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name='splash' component={Splash} />
        <Stack.Screen options={{headerShown: false}} name='login' component={Login} />
        <Stack.Screen options={{headerShown: false}} name='register' component={Register}/>
        <Stack.Screen options={{headerShown: false}} name='forgot-password' component={ForgotPassword}/>
        <Stack.Screen options={{headerShown: false}} name='verify-code' component={VerificationCode}/>
        <Stack.Screen options={{headerShown: false}} name='reset-password' component={ResetPassword}/>
        <Stack.Screen options={{headerShown: false}} name='home' component={Home}/>
    </Stack.Navigator>
  )
}

export default StackNav
