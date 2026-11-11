import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { categoriesData } from '../data/categories';

export default function Categorias() {
  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho da Página */}
        <View style={styles.titleContainer}>
          <View style={styles.titleTagContainer}>
            <View style={styles.dot} />
            <Text style={styles.titleTag}>ATELIÊ BOTÂNICO</Text>
          </View>
          <Text style={styles.title}>Categorias Florais</Text>
          <Text style={styles.subtitle}>Navegue pela nossa seleção artesanal colhida ao amanhecer.</Text>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={theme.colors.textOutline} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar categorias, hastes ou estilos..."
            placeholderTextColor={theme.colors.textOutline}
          />
        </View>

        {/* Filtros (Chips) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipTextActive}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Flores & Bouquets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Casa & Vasos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Celebrações</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Card Destaque: Monte seu Bouquet */}
        <TouchableOpacity 
          style={styles.heroCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/produto/1')}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTag}>
              <MaterialIcons name="auto-awesome" size={12} color={theme.colors.primary} />
              <Text style={styles.heroTagText}>EXPERIÊNCIA INTERATIVA</Text>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroSubtitle}>PERSONALIZE DO SEU JEITO</Text>
              <Text style={styles.heroTitle}>Monte seu bouquet</Text>
              <Text style={styles.heroDesc} numberOfLines={1}>Selecione folhas, peônias e laços artesanais.</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Grade de Categorias */}
        <View style={styles.gridContainer}>
          {categoriesData.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryImageContainer}>
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <View style={styles.optionsBadge}>
                  <Text style={styles.optionsText}>{category.options}</Text>
                </View>
              </View>
              <View style={styles.categoryInfo}>
                <View style={styles.categoryTagContainer}>
                  <View style={[styles.dot, { backgroundColor: category.tagColor }]} />
                  <Text style={[styles.categoryTag, { color: category.tagColor }]}>{category.tag}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDesc} numberOfLines={2}>{category.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24 },
  
  titleContainer: { paddingHorizontal: theme.spacing.margin, marginTop: 16, marginBottom: 16 },
  titleTagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.tertiary, marginRight: 6 },
  titleTag: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.tertiary, letterSpacing: 1 },
  title: { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.primary },
  subtitle: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, paddingHorizontal: 16, height: 48, borderRadius: 24 },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textPrimary },

  chipsScroll: { paddingHorizontal: theme.spacing.margin, marginTop: 16, marginBottom: 20, maxHeight: 40 },
  chip: { backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.textSecondary },
  chipTextActive: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.white },

  heroCard: { marginHorizontal: theme.spacing.margin, height: 180, borderRadius: theme.radius.lg, overflow: 'hidden', marginBottom: 20 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(30,45,30,0.5)', padding: 16, justifyContent: 'space-between' },
  heroTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  heroTagText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primary, marginLeft: 4 },
  heroContent: { marginBottom: 4 },
  heroSubtitle: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.sunflower, letterSpacing: 1 },
  heroTitle: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.white },
  heroDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.surfaceContainer, marginTop: 2 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: theme.spacing.margin - 6, justifyContent: 'space-between' },
  categoryCard: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, marginBottom: 12, overflow: 'hidden' },
  categoryImageContainer: { height: 120, width: '100%', position: 'relative' },
  categoryImage: { width: '100%', height: '100%' },
  optionsBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  optionsText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary },
  categoryInfo: { padding: 12 },
  categoryTagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryTag: { fontFamily: theme.fonts.bodyBold, fontSize: 9, letterSpacing: 0.5 },
  categoryName: { fontFamily: theme.fonts.title, fontSize: 16, color: theme.colors.primary, marginBottom: 4 },
  categoryDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, lineHeight: 16 },
});