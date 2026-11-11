import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';

export default function Cadastro() {
  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subText}>Este é o perfil da cliente principal do projeto.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <MaterialIcons name="person" size={20} color={theme.colors.textOutline} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value="Sofia Albuquerque"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <MaterialIcons name="email" size={20} color={theme.colors.textOutline} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value="sofia@triflora.demo"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <MaterialIcons name="lock" size={20} color={theme.colors.textOutline} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value="••••••••••••"
                editable={false}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>
              Tela ilustrativa. Neste projeto, a conta da Sofia é a única cadastrada e gerenciada localmente.
            </Text>
          </View>

          <TouchableOpacity style={styles.backToLoginButton} onPress={() => router.back()}>
            <Text style={styles.backToLoginText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, padding: theme.spacing.margin, paddingTop: 40 },
  
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: 16 },
  
  header: { marginBottom: 32 },
  title: { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.primary },
  subText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 },

  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, height: 56 },
  inputDisabled: { backgroundColor: theme.colors.surfaceContainer, opacity: 0.8 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.textSecondary },

  infoBox: { flexDirection: 'row', backgroundColor: theme.colors.primaryFixed, padding: 16, borderRadius: theme.radius.md, marginTop: 16, alignItems: 'center' },
  infoText: { flex: 1, fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.primary, marginLeft: 12, lineHeight: 18 },

  backToLoginButton: { backgroundColor: theme.colors.primary, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  backToLoginText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, textTransform: 'uppercase' },
});