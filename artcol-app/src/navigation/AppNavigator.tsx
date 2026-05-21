import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/app/HomeScreen';
import { ProfileScreen } from '@/screens/app/ProfileScreen';
import { EditProfileScreen } from '@/screens/app/EditProfileScreen';
import { CreatePostScreen } from '@/screens/app/CreatePostScreen';
import { PostDetailScreen } from '@/screens/app/PostDetailScreen';
import { colors, fonts } from '@/lib/theme';

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  CreatePost: undefined;
  PostDetail: { postId: string; focusComment?: boolean };
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
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Nouveau post', presentation: 'modal' }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Post' }}
      />
    </Stack.Navigator>
  );
}
