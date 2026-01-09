import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Icone incluse in Expo

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#2D5A27' }}> {/* Colore primario del tuo partner */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Esplora',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cerca',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
        }}
      />
      {/* Aggiungi qui favorites e profile allo stesso modo */}
    </Tabs>
  );
}