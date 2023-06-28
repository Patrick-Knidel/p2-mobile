import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppLogin from '../AppLogin';
import AppMainScreen from '../AppMainScreen';
import AppSignUp from '../AppSignUp';
import AppContatos from '../AppContatos';
import AppChatScreen from '../AppChatScreen';
import AppNovoContato from '../AppNovoContato';

const Stack = createStackNavigator();

export default function AppTab() {
  return (
      <NavigationContainer independent={true}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="AppLogin"
            component={AppLogin}
          />

          <Stack.Screen 
            name="AppMainScreen"
            component={AppMainScreen}
          />   

          <Stack.Screen 
            name="AppSignUp"
            component={AppSignUp}
          /> 

          <Stack.Screen 
            name="AppContatos"
            component={AppContatos}
          /> 

          <Stack.Screen 
            name="AppChatScreen"
            component={AppChatScreen}
          />

          <Stack.Screen 
            name="AppNovoContato"
            component={AppNovoContato}
          /> 

        </Stack.Navigator>
      </NavigationContainer>
    )
}