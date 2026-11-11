import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: HeaderProps) {
  
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Imagem de Fundo que ocupa toda a largura */}
        <Image 
          source={require('../assets/foto_header.png')} 
          style={styles.headerImage}
          resizeMode="cover" 
        />

        {/* Botão de voltar sobreposto à imagem (se necessário) */}
        {showBackButton && (
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
              <View style={styles.iconBackground}>
                <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  container: {
    height: 80, // Altura fixa para o cabeçalho
    width: '100%',
    position: 'relative', // Permite que o botão de voltar fique em cima da imagem
    justifyContent: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: theme.spacing.margin,
    justifyContent: 'center',
    zIndex: 10,
  },
  iconButton: {
    width: 40, 
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo semi-transparente para o ícone de voltar ficar visível sobre a foto
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  }
});