import { Tabs } from 'expo-router';
import { Chrome as Home, Package, DollarSign, User, MessageSquare } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000000',
            borderTopColor: '#FFD700',
            borderTopWidth: 1,
            height: 90,
            paddingBottom: 25,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '工作台',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: '訂單',
            tabBarIcon: ({ size, color }) => (
              <Package size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            title: '收入',
            tabBarIcon: ({ size, color }) => (
              <DollarSign size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: '訊息',
            tabBarIcon: ({ size, color }) => (
              <MessageSquare size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '個人',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" backgroundColor="#000000" />
    </>
  );
}