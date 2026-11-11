import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bodyBold,
          fontSize: 10,
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color }) => <MaterialIcons name="local-florist" size={24} color={color} />
        }} 
      />
      
      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Image 
              source={require('../../assets/avatar_sofia.png')} 
              style={[
                styles.avatarIcon, 
                { borderColor: focused ? theme.colors.primary : 'transparent' }
              ]} 
            />
          )
        }} 
      />

      <Tabs.Screen 
        name="carrinho" 
        options={{ 
          title: 'Carrinho',
          tabBarIcon: ({ color }) => <MaterialIcons name="shopping-basket" size={24} color={color} />
        }} 
      />

      <Tabs.Screen 
        name="clube-tf" 
        options={{ 
          title: 'Clube TF',
          tabBarIcon: ({ color }) => <MaterialIcons name="loyalty" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  avatarIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    // Se a aba estiver ativa, a borda fica verde, se não, fica transparente
  }
});