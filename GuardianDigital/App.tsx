import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeLauncherScreen from './src/screens/HomeLauncherScreen';
import ContactsCrudScreen from './src/screens/ContactsCrudScreen';
import ScamShieldScreen from './src/screens/ScamShieldScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeLauncher" component={HomeLauncherScreen} />
          <Stack.Screen name="ContactsCrud" component={ContactsCrudScreen} />
          <Stack.Screen name="ScamShield" component={ScamShieldScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}