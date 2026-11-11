import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Header } from '../../components/Header';

export default function ClubeTF() {
  const benefits = [
    { icon: 'local-shipping', title: 'Entrega Cortesia Ilimitada', desc: 'Frete express com manuseio climatizado gratuito para todos os seus pedidos.' },
    { icon: 'spa', title: 'Bouquet da Estação', desc: '1 arranjo autoral surpresa com flores frescas entregue todo dia 15.', tag: 'Mensal' },
    { icon: 'lock-open', title: 'Colheitas Raras Antecipadas', desc: 'Prioridade de 48h em lotes restritos de lírios orientais e peônias.' },
    { icon: 'percent', title: 'Desconto Permanente de 15%', desc: 'Aplicado automaticamente em arranjos de mesa, kits festa e vasos.' },
  ];

  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho */}
        <View style={styles.headerSection}>
          <View style={styles.tagContainer}>
            <MaterialIcons name="spa" size={14} color={theme.colors.primary} />
            <Text style={styles.tagText}>CLUBE TF • ASSINATURA & AFETO</Text>
          </View>
          <Text style={styles.title}>O refúgio de quem cultiva a beleza natural</Text>
          <Text style={styles.subtitle}>Experiências botânicas curadas à mão e privilégios que florescem a cada estação.</Text>
        </View>

        {/* Cartão VIP */}
        <View style={styles.vipCard}>
          <View style={styles.vipHeader}>
            <View style={styles.vipBadge}>
              <MaterialIcons name="workspace-premium" size={16} color={theme.colors.sunflower} />
              <Text style={styles.vipBadgeText}>MEMBRO EXCLUSIVO</Text>
            </View>
            <View style={styles.vipTier}>
              <Text style={styles.vipTierText}>NÍVEL MAGNÓLIA</Text>
            </View>
          </View>

          <Text style={styles.vipNameLabel}>NOME DO ASSOCIADO</Text>
          <Text style={styles.vipName}>Sofia Albuquerque</Text>

          <View style={styles.vipFooter}>
            <View>
              <Text style={styles.vipMemberSinceLabel}>MEMBRO DESDE</Text>
              <Text style={styles.vipMemberSince}>Outubro, 2023</Text>
            </View>
            <View style={styles.vipPass}>
              <MaterialIcons name="qr-code-2" size={16} color={theme.colors.sunflower} />
              <Text style={styles.vipPassText}>Passe Virtual</Text>
            </View>
          </View>
        </View>

        {/* Benefícios */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>PRIVILÉGIOS</Text>
            <Text style={styles.sectionTitle}>Seus Benefícios Ativos</Text>
          </View>
          <MaterialIcons name="verified" size={24} color={theme.colors.primary} />
        </View>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <View style={styles.benefitIconBox}>
                <MaterialIcons name={benefit.icon as any} size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.benefitInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  {benefit.tag && (
                    <View style={styles.benefitTag}><Text style={styles.benefitTagText}>{benefit.tag}</Text></View>
                  )}
                </View>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Atendimento */}
        <View style={styles.supportCard}>
          <MaterialIcons name="support-agent" size={32} color={theme.colors.primary} />
          <Text style={styles.supportTitle}>Atendimento Florista Pessoal</Text>
          <Text style={styles.supportDesc}>Dúvidas sobre o cultivo ou pedidos sob medida? Chame sua concierge dedicada.</Text>
          <TouchableOpacity style={styles.supportButton}>
            <MaterialIcons name="chat" size={18} color={theme.colors.white} />
            <Text style={styles.supportButtonText}>Falar pelo WhatsApp</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24 },
  
  headerSection: { paddingHorizontal: theme.spacing.margin, marginTop: 16, alignItems: 'center' },
  tagContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  tagText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary, letterSpacing: 1, marginLeft: 6 },
  title: { fontFamily: theme.fonts.title, fontSize: 26, color: theme.colors.primary, textAlign: 'center', lineHeight: 34 },
  subtitle: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },

  vipCard: { marginHorizontal: theme.spacing.margin, marginTop: 24, backgroundColor: '#274228', borderRadius: theme.radius.lg, padding: 24 },
  vipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  vipBadge: { flexDirection: 'row', alignItems: 'center' },
  vipBadgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.sunflower, marginLeft: 6, letterSpacing: 1 },
  vipTier: { backgroundColor: '#E6D7C1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  vipTierText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: '#274228' },
  vipNameLabel: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: '#E6D7C1', opacity: 0.7, letterSpacing: 1 },
  vipName: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.white, marginTop: 4 },
  vipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(230,215,193,0.2)', paddingTop: 16 },
  vipMemberSinceLabel: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: '#E6D7C1', opacity: 0.7 },
  vipMemberSince: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.white, marginTop: 2 },
  vipPass: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(230,215,193,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  vipPassText: { fontFamily: theme.fonts.bodyBold, fontSize: 11, color: theme.colors.white, marginLeft: 6 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: theme.spacing.margin, marginTop: 32, marginBottom: 16 },
  sectionTag: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.secondary, letterSpacing: 1 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 22, color: theme.colors.primary },

  benefitsContainer: { paddingHorizontal: theme.spacing.margin, gap: 12 },
  benefitCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.md, alignItems: 'flex-start' },
  benefitIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  benefitInfo: { flex: 1 },
  benefitTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  benefitTag: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginLeft: 8 },
  benefitTagText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primary },
  benefitDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 18 },

  supportCard: { marginHorizontal: theme.spacing.margin, marginTop: 24, backgroundColor: theme.colors.primaryFixed, padding: 24, borderRadius: theme.radius.lg, alignItems: 'center' },
  supportTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary, marginTop: 12 },
  supportDesc: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  supportButton: { flexDirection: 'row', backgroundColor: theme.colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  supportButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, marginLeft: 8 },
});