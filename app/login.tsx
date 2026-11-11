import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';

export default function Login() {
  // Dados já preenchidos com a conta da Sofia
  const [email, setEmail] = useState('sofia@triflora.demo');
  const [password, setPassword] = useState('triflora2024');

  const handleLogin = () => {
    // Como é um projeto demonstrativo, qualquer clique entra.
    // Futuramente, aqui entrará a validação com o AsyncStorage.
    router.replace('/(tabs)'); 
  };

  return (
    <KeyboardAvoidingView 
      style={styles.mainContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.logo}>TRIFLORA</Text>
          <Text style={styles.welcomeText}>Bem-vinda de volta 🌷</Text>
          <Text style={styles.subText}>Entre para continuar sua experiência botânica.</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Campo de E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={theme.colors.textOutline} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo de Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={theme.colors.textOutline} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          {/* Divisor */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botão Entrar como Sofia */}
          <TouchableOpacity style={styles.demoButton} onPress={handleLogin}>
            <MaterialIcons name="spa" size={20} color={theme.colors.tertiary} />
            <Text style={styles.demoButtonText}>Entrar como Sofia (Demo)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem conta?</Text>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={styles.footerLink}> Criar conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.warningText}>
          ⚠️ Login demonstrativo — os dados ficam apenas neste aparelho.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: theme.spacing.margin },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontFamily: theme.fonts.title, fontSize: 36, color: theme.colors.primary, letterSpacing: 2, marginBottom: 24 },
  welcomeText: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary },
  subText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, marginTop: 8, textAlign: 'center' },

  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 16 },
  label: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.textPrimary },

  loginButton: { backgroundColor: theme.colors.primary, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  loginButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.white, textTransform: 'uppercase' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textOutline, marginHorizontal: 16 },

  demoButton: { flexDirection: 'row', backgroundColor: 'rgba(240, 122, 58, 0.1)', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(240, 122, 58, 0.3)' },
  demoButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.tertiary, marginLeft: 8 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary },
  footerLink: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },

  warningText: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textOutline, textAlign: 'center', marginTop: 40 },
});