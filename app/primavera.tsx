import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';

// Produtos da Coleção de Primavera
const primaveraProducts = [
  {
    id: 'p1',
    name: 'Buquê de Tulipas Coloridas',
    category: 'Tulipas',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1587577319445-8db6d7eb278a?q=80&w=600&auto=format&fit=crop',
    tag: 'PRIMAVERA',
    tagColor: '#E67BA0',
  },
  {
    id: 'p2',
    name: 'Buquê de Margaridas Silvestres',
    category: 'Margaridas',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=600&auto=format&fit=crop',
    tag: 'CAMPESTRE',
    tagColor: '#F2B33D',
  },
  {
    id: 'p3',
    name: 'Arranjo de Peônias Cor-de-Rosa',
    category: 'Peônias',
    price: 219.90,
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=600&auto=format&fit=crop',
    tag: 'ASSINATURA',
    tagColor: '#E67BA0',
  },
  {
    id: 'p4',
    name: 'Buquê de Lírios Brancos',
    category: 'Lírios',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=600&auto=format&fit=crop',
    tag: 'DELICADO',
    tagColor: '#7DAA7A',
  },
  {
    id: 'p5',
    name: 'Cesta de Girassóis',
    category: 'Girassóis',
    price: 179.90,
    image: 'https://images.unsplash.com/photo-1591886812855-0a73fc23f5ce?q=80&w=600&auto=format&fit=crop',
    tag: 'ALEGRIA',
    tagColor: '#F2B33D',
  },
  {
    id: 'p6',
    name: 'Buquê de Lavanda Aromática',
    category: 'Lavanda',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1596438459194-f28de43b12ee?q=80&w=600&auto=format&fit=crop',
    tag: 'RELAXANTE',
    tagColor: '#9B6DBA',
  },
];

export default function Primavera() {
  const { addItem } = useCart();

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Hero da Coleção */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroTagContainer}>
              <MaterialIcons name="local-florist" size={14} color={theme.colors.white} />
              <Text style={styles.heroTagText}>NOVA ESTAÇÃO</Text>
            </View>
            <Text style={styles.heroTitle}>Coleção de Primavera</Text>
            <Text style={styles.heroSubtitle}>Flores frescas colhidas ao amanhecer para celebrar a estação mais colorida do ano.</Text>
          </View>
        </View>

        {/* Grade 2x3 de Produtos */}
        <View style={styles.gridContainer}>
          {primaveraProducts.map((product) => (
            <TouchableOpacity 
              key={product.id}
              style={styles.productCard}
              onPress={() => router.push(`/produto/${product.id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={[styles.tagBadge, { backgroundColor: product.tagColor }]}>
                  <Text style={styles.tagText}>{product.tag}</Text>
                </View>
              </View>

              <View style={styles.productInfo}>
                <Text style={[styles.categoryText, { color: product.tagColor }]}>
                  {product.category.toUpperCase()}
                </Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                  <TouchableOpacity 
                    style={[styles.addButton, { borderColor: product.tagColor }]}
                    onPress={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        type: 'product',
                      });
                      router.push('/(tabs)/carrinho');
                    }}
                  >
                    <MaterialIcons name="add" size={20} color={product.tagColor} />
                  </TouchableOpacity>
                </View>
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
  scrollContent: { paddingBottom: 32, paddingTop: 16 },

  // Banner Hero
  heroContainer: { marginHorizontal: theme.spacing.margin, height: 220, borderRadius: theme.radius.lg, overflow: 'hidden', marginBottom: 24 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(62,90,62,0.55)', padding: 20, justifyContent: 'flex-end' },
  heroTagContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  heroTagText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.white, letterSpacing: 1.5 },
  heroTitle: { fontFamily: theme.fonts.title, fontSize: 26, color: theme.colors.white, marginBottom: 6 },
  heroSubtitle: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.surfaceContainer, lineHeight: 18 },

  // Título da Grade
  titleContainer: { paddingHorizontal: theme.spacing.margin, marginBottom: 16 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 22, color: theme.colors.primary },
  sectionSubtitle: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 },

  // Grade de Produtos
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: theme.spacing.margin - 6, 
    justifyContent: 'space-between',
  },
  productCard: { 
    width: '48%', 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.radius.md, 
    padding: 10, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: theme.colors.border,
  },
  imageContainer: { position: 'relative', width: '100%', height: 150, borderRadius: theme.radius.sm, overflow: 'hidden', marginBottom: 10 },
  productImage: { width: '100%', height: '100%' },
  tagBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText: { fontFamily: theme.fonts.bodyBold, fontSize: 8, color: theme.colors.white, letterSpacing: 0.8 },

  productInfo: { paddingHorizontal: 4 },
  categoryText: { fontFamily: theme.fonts.bodyBold, fontSize: 8, letterSpacing: 1, marginBottom: 4 },
  productName: { fontFamily: theme.fonts.title, fontSize: 14, color: theme.colors.primary, marginBottom: 8, minHeight: 36 },

  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontFamily: theme.fonts.bodyBold, fontSize: 15, color: theme.colors.primary },
  addButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});