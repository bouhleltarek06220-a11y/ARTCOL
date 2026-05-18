import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/app/HomeScreen';
import { ProfileScreen } from '@/screens/app/ProfileScreen';
import { EditProfileScreen } from '@/screens/app/EditProfileScreen';
import { colors, fonts } from '@/lib/theme';

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgDeep },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: fonts.displayBold },
        contentStyle: { backgroundColor: colors.bgDeep },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Édition' }}
      />
    </Stack.Navigator>
  );
}
