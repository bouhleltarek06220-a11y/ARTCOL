import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/app/HomeScreen';
import { ProfileScreen } from '@/screens/app/ProfileScreen';
import { EditProfileScreen } from '@/screens/app/EditProfileScreen';
import { CreatePostScreen } from '@/screens/app/CreatePostScreen';
import { PostDetailScreen } from '@/screens/app/PostDetailScreen';
import { SearchScreen } from '@/screens/app/SearchScreen';
import { UserProfileScreen } from '@/screens/app/UserProfileScreen';
import { CollabsScreen } from '@/screens/app/CollabsScreen';
import { CollabDetailScreen } from '@/screens/app/CollabDetailScreen';
import { NewCollabScreen } from '@/screens/app/NewCollabScreen';
import { colors, fonts, fontSize, spacing } from '@/lib/theme';

/**
 * Architecture :
 *   RootStack contient les tabs + tous les écrans qui se push par-dessus
 *   (PostDetail, UserProfile, EditProfile, modals CreatePost / NewCollab, etc.)
 *   Les tab screens utilisent `useNavigation<NativeStackNavigationProp<AppStackParamList>>()`
 *   pour pouvoir naviguer vers les écrans root.
 */

export type MainTabsParamList = {
  FeedTab: undefined;
  DiscoverTab: undefined;
  CollabsTab: undefined;
  MeTab: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  EditProfile: undefined;
  CreatePost: undefined;
  PostDetail: { postId: string; focusComment?: boolean };
  UserProfile: { userId: string };
  CollabDetail: { collabId: string };
  NewCollab: { recipientId: string };
};

const Tab = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

const TAB_ICONS: Record<keyof MainTabsParamList, string> = {
  FeedTab: '◧',
  DiscoverTab: '⌕',
  CollabsTab: '⇄',
  MeTab: '◉',
};

const TAB_LABELS: Record<keyof MainTabsParamList, string> = {
  FeedTab: 'Feed',
  DiscoverTab: 'Découvrir',
  CollabsTab: 'Collabs',
  MeTab: 'Moi',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={tabStyles.bar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const name = route.name as keyof MainTabsParamList;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={tabStyles.btn}
            accessibilityRole="button"
            accessibilityLabel={TAB_LABELS[name]}
            accessibilityState={focused ? { selected: true } : {}}
          >
            <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>
              {TAB_ICONS[name]}
            </Text>
            <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
              {TAB_LABELS[name]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bgDeep },
      }}
    >
      <Tab.Screen name="FeedTab" component={HomeScreen} />
      <Tab.Screen name="DiscoverTab" component={SearchScreen} />
      <Tab.Screen name="CollabsTab" component={CollabsScreen} />
      <Tab.Screen name="MeTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

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
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Édition' }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Post' }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profil' }}
      />
      <Stack.Screen
        name="CollabDetail"
        component={CollabDetailScreen}
        options={{ title: 'Collab' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Nouveau post', presentation: 'modal' }}
      />
      <Stack.Screen
        name="NewCollab"
        component={NewCollabScreen}
        options={{ title: 'Nouvelle collab', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
  },
  icon: {
    fontSize: 22,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  iconActive: {
    color: colors.neonLime,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.neonLime,
  },
});
