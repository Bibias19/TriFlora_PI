import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Header } from '../../components/Header';

export default function Perfil() {
  
  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: () => router.replace('/login') 
        }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cartão Principal do Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/avatar_sofia.png')} 
              style={styles.avatar} 
            />
            <View style={styles.avatarBadge}>
              <MaterialIcons name="local-florist" size={14} color={theme.colors.white} />
            </View>
          </View>
          
          <Text style={styles.name}>Sofia Albuquerque</Text>
          <Text style={styles.email}>sofia.albuquerque@email.com</Text>
          
          {/* Badge que leva para o Clube TF */}
          <TouchableOpacity style={styles.tierBadge} onPress={() => router.push('/clube-tf')}>
            <MaterialIcons name="workspace-premium" size={16} color={theme.colors.primary} />
            <Text style={styles.tierText}>MEMBRO TRIFLORA OURO</Text>
            <MaterialIcons name="chevron-right" size={16} color={theme.colors.primary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Atalhos Rápidos */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.quickActionIcon}><MaterialIcons name="inventory-2" size={22} color={theme.colors.primary} /></View>
            <Text style={styles.quickActionTitle}>Pedidos</Text>
            <Text style={styles.quickActionSubtitle}>3 ativos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.quickActionIcon}><MaterialIcons name="favorite" size={22} color={theme.colors.primary} /></View>
            <Text style={styles.quickActionTitle}>Favoritos</Text>
            <Text style={styles.quickActionSubtitle}>12 itens</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <View style={styles.quickActionIcon}><MaterialIcons name="location-on" size={22} color={theme.colors.primary} /></View>
            <Text style={styles.quickActionTitle}>Endereços</Text>
            <Text style={styles.quickActionSubtitle}>2 salvos</Text>
          </TouchableOpacity>
        </View>

        {/* Último Pedido */}
        <View style={styles.lastOrderCard}>
          <View style={styles.lastOrderIcon}>
            <MaterialIcons name="local-shipping" size={20} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.lastOrderTitle}>ÚLTIMO PEDIDO #TF-4891</Text>
            <Text style={styles.lastOrderDesc}>Em separação com o florista</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
        </View>

        {/* Menu de Opções */}
        <Text style={styles.sectionTitle}>MINHA EXPERIÊNCIA</Text>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="receipt-long" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuItemText}>Meus Pedidos & Rastreamento</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textOutline} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="badge" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuItemText}>Dados Pessoais & Contato</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textOutline} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="credit-card" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuItemText}>Cartões & Pagamentos</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textOutline} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="support-agent" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.menuItemText}>Ajuda & Atendimento</Text>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.textOutline} />
          </TouchableOpacity>
        </View>

        {/* Card Assinatura */}
        <TouchableOpacity style={styles.subscriptionCard} onPress={() => router.push('/clube-tf')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subTitle}>Assinatura Botânica</Text>
            <Text style={styles.subDesc}>Próxima entrega: 14 de Novembro</Text>
          </View>
          <View style={styles.subButton}>
            <Text style={styles.subButtonText}>Gerenciar</Text>
          </View>
        </TouchableOpacity>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24, paddingHorizontal: theme.spacing.margin },
  
  profileCard: { alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 24, marginTop: 16, marginBottom: 16 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: theme.colors.primaryFixed },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.white },
  name: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary },
  email: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, marginBottom: 12 },
  tierBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tierText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary, marginLeft: 6, letterSpacing: 0.5 },

  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 8 },
  quickActionCard: { flex: 1, backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.md, alignItems: 'center' },
  quickActionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickActionTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.primary },
  quickActionSubtitle: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },

  lastOrderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, padding: 16, borderRadius: theme.radius.md, marginBottom: 24 },
  lastOrderIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
  lastOrderTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 11, color: theme.colors.primary, letterSpacing: 0.5 },
  lastOrderDesc: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.primary, marginTop: 2 },

  sectionTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 11, color: theme.colors.textSecondary, letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  menuContainer: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuItemText: { flex: 1, fontFamily: theme.fonts.bodyMedium, fontSize: 15, color: theme.colors.primary, marginLeft: 12 },
  divider: { height: 1, backgroundColor: theme.colors.surfaceContainer, marginLeft: 52 },

  subscriptionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, padding: 16, borderRadius: theme.radius.md, marginBottom: 24 },
  subTitle: { fontFamily: theme.fonts.title, fontSize: 18, color: theme.colors.primary },
  subDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  subButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  subButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.white },

  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(186, 26, 26, 0.1)', paddingVertical: 16, borderRadius: theme.radius.md },
  logoutText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.error, marginLeft: 8 },
});