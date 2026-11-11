import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Header } from '../../components/Header';
import { productsData } from '../../data/products';

export default function Index() {
  const estacaoProducts = productsData.filter(p => p.category === 'Flores da Estação' || p.category === 'Assinatura Triflora');
  const gridProducts = productsData.filter(p => p.category !== 'Flores da Estação' && p.category !== 'Assinatura Triflora');

  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Saudação e Notificação */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingSmall}>BOM DIA</Text>
            <Text style={styles.greetingLarge}>Olá, Sofia</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={22} color={theme.colors.primary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={theme.colors.textOutline} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar flores, lírios, arranjos..."
            placeholderTextColor={theme.colors.textOutline}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Banner Principal */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>COLEÇÃO DE OUTONO</Text>
            <Text style={styles.heroTitle}>Flores que conectam histórias</Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/categorias')}>
              <Text style={styles.heroButtonText}>Explorar Coleção</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chips de Categorias */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <MaterialIcons name="spa" size={16} color={theme.colors.white} />
            <Text style={styles.chipTextActive}>Bouquets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <MaterialIcons name="nature" size={16} color={theme.colors.secondary} />
            <Text style={styles.chipText}>Flores Soltas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip} onPress={() => router.push('/monte-bouquet')}>
            <MaterialIcons name="auto-fix-high" size={16} color={theme.colors.tertiary} />
            <Text style={styles.chipText}>Monte o Seu</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Semana Especial (Promoções) */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>OPORTUNIDADES</Text>
            <Text style={styles.sectionTitle}>Semana Especial</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/categorias')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoInfo}>
            <View style={styles.promoTag}>
              <Text style={styles.promoTagText}>-20% OFF</Text>
            </View>
            <Text style={styles.promoTitle}>Semana do Girassol & Lírio</Text>
            <Text style={styles.promoDesc}>Harmonia radiante em tons dourados.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <Text style={styles.promoPrice}>R$ 159,20</Text>
              <Text style={styles.promoOldPrice}>R$ 199,00</Text>
            </View>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=400&auto=format&fit=crop' }} 
            style={styles.promoImage} 
          />
        </View>

        {/* Flores da Estação */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>COLHEITA MATINAL</Text>
            <Text style={styles.sectionTitle}>Flores da Estação</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {estacaoProducts.map(product => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push(`/produto/${product.id}`)}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                <View style={styles.addButton}>
                  <MaterialIcons name="add" size={20} color={theme.colors.white} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mais Vendidos */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>FAVORITOS DA CASA</Text>
            <Text style={styles.sectionTitle}>Mais Vendidos</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/categorias')}>
            <Text style={styles.seeAllText}>Catálogo →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {gridProducts.map(product => (
            <TouchableOpacity key={product.id} style={styles.gridCard} onPress={() => router.push(`/produto/${product.id}`)}>
              <View style={styles.gridImageContainer}>
                <Image source={{ uri: product.image }} style={styles.gridImage} />
                <TouchableOpacity style={styles.gridFavButton}>
                  <MaterialIcons name="favorite-border" size={16} color={theme.colors.textOutline} />
                </TouchableOpacity>
              </View>
              <Text style={styles.gridTag}>{product.category.toUpperCase()}</Text>
              <Text style={styles.gridName} numberOfLines={2}>{product.name}</Text>
              <View style={styles.gridFooter}>
                <Text style={styles.gridPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                <View style={styles.gridAddBtn}>
                  <MaterialIcons name="add" size={18} color={theme.colors.white} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Arranjo Sob Medida */}
        <View style={styles.customBanner}>
          <View style={styles.customIconBox}>
            <MaterialIcons name="local-florist" size={24} color={theme.colors.white} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.customTitle}>Deseja um arranjo sob medida?</Text>
            <Text style={styles.customDesc}>Nossos floristas parceiros criam uma composição exclusiva para o seu momento.</Text>
            <TouchableOpacity onPress={() => router.push('/monte-bouquet')}>
              <Text style={styles.customLink}>Iniciar consultoria floral →</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  
  // AQUI ESTÁ A MUDANÇA: paddingTop de 32 para descer o conteúdo
  scrollContent: { 
    paddingBottom: 24, 
    paddingTop: 32 
  },
  
  greetingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.margin, marginTop: 0 },
  greetingSmall: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.secondary, letterSpacing: 1 },
  greetingLarge: { fontFamily: theme.fonts.title, fontSize: 26, color: theme.colors.primary },
  notificationButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
  notificationDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.rose },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, marginTop: 12, paddingHorizontal: 16, height: 50, borderRadius: 25 },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textPrimary },
  filterButton: { padding: 8 },

  heroBanner: { marginHorizontal: theme.spacing.margin, marginTop: 20, height: 200, borderRadius: theme.radius.lg, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(62,90,62,0.6)', padding: 20, justifyContent: 'flex-end' },
  heroTag: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primaryFixed, letterSpacing: 1, marginBottom: 4 },
  heroTitle: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.white, marginBottom: 12 },
  heroButton: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  heroButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary },

  chipsScroll: { marginTop: 20, paddingHorizontal: theme.spacing.margin, maxHeight: 40 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.primary, marginLeft: 6 },
  chipTextActive: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.white, marginLeft: 6 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: theme.spacing.margin, marginTop: 24, marginBottom: 12 },
  sectionTag: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.tertiary, letterSpacing: 1 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  seeAllText: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.secondary },

  promoCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, borderRadius: theme.radius.md, padding: 16, alignItems: 'center' },
  promoInfo: { flex: 1 },
  promoTag: { backgroundColor: theme.colors.tertiary, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  promoTagText: { color: theme.colors.white, fontSize: 10, fontFamily: theme.fonts.bodyBold },
  promoTitle: { fontFamily: theme.fonts.title, fontSize: 16, color: theme.colors.primary },
  promoDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  promoPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 18, color: theme.colors.primary },
  promoOldPrice: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline, textDecorationLine: 'line-through' },
  promoImage: { width: 90, height: 90, borderRadius: theme.radius.md, marginLeft: 16 },

  horizontalScroll: { paddingLeft: theme.spacing.margin, marginBottom: 12 },
  productCard: { width: 140, marginRight: 16, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 10 },
  productImage: { width: '100%', height: 120, borderRadius: theme.radius.sm, marginBottom: 8 },
  productName: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.primary },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  addButton: { backgroundColor: theme.colors.secondary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: theme.spacing.margin - 6, justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 12, marginBottom: 12 },
  gridImageContainer: { position: 'relative', width: '100%', height: 140, borderRadius: theme.radius.sm, overflow: 'hidden', marginBottom: 10 },
  gridImage: { width: '100%', height: '100%' },
  gridFavButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.8)', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridTag: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.rose, letterSpacing: 0.5, marginBottom: 4 },
  gridName: { fontFamily: theme.fonts.title, fontSize: 15, color: theme.colors.primary, marginBottom: 2 },
  gridFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  gridPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 15, color: theme.colors.primary },
  gridAddBtn: { backgroundColor: theme.colors.secondary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  customBanner: { flexDirection: 'row', backgroundColor: theme.colors.primaryFixed, marginHorizontal: theme.spacing.margin, padding: 16, borderRadius: theme.radius.md, marginTop: 12, alignItems: 'center' },
  customIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  customTitle: { fontFamily: theme.fonts.title, fontSize: 16, color: theme.colors.primary },
  customDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 16 },
  customLink: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginTop: 8 },
});