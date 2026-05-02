import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { colors, font } from '../constants/theme';

function injectInterFont() {
  if (Platform.OS !== 'web') return;
  if (document.getElementById('inter-font')) return;
  const link = document.createElement('link');
  link.id = 'inter-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
  document.head.appendChild(link);
}

function TabIcon({
  name,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
}) {
  return (
    <Ionicons
      name={name}
      size={24}
      color={focused ? colors.coral : colors.mutedLight}
    />
  );
}

function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.mutedLight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cupid"
        options={{
          title: 'Cupid',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'heart-circle' : 'heart-circle-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sparks"
        options={{
          title: 'Sparks',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'flash' : 'flash-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'trophy' : 'trophy-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person-circle' : 'person-circle-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  useEffect(() => {
    injectInterFont();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.phoneShell}>
          <AppTabs />
        </View>
      </View>
    );
  }

  return <AppTabs />;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 84,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: font ?? undefined,
    fontWeight: '500',
    marginTop: -2,
  },
  webWrapper: {
    flex: 1,
    backgroundColor: '#080410',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
  },
  phoneShell: {
    width: 390,
    height: 844,
    overflow: 'hidden',
    borderRadius: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 32 },
    shadowOpacity: 0.7,
    shadowRadius: 60,
    elevation: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
