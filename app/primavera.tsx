import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { productsData } from '../data/products';
import { localImages } from '../data/localImages';

// Tags visuais específicas da tela de Primavera (apenas apresentação)
const primaveraTags: Record<string, { tag: string; tagColor: string }> = {
  p1: { tag: 'PRIMAVERA',  tagColor: '#E67BA0' },
  p2: { tag: 'CAMPESTRE',  tagColor: '#F2B33D' },
  p3: { tag: 'ASSINATURA', tagColor: '#E67BA0' },
  p4: { tag: 'DELICADO',   tagColor: '#7DAA7A' },
  p5: { tag: 'ALEGRIA',    tagColor: '#F2B33D' },
  p6: { tag: 'RELAXANTE',  tagColor: '#9B6DBA' },
};

export default function Primavera() {
  const { addItem } = useCart();

  // ✅ Fonte única de verdade: filtra direto do catálogo
  const primaveraProducts = productsData.filter(p => p.category === 'Primavera');

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Hero da Coleção */}
        <View style={styles.heroContainer}>
          <Image 
            source={localImages.springHero}
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
          {primaveraProducts.map((product) => {
            // Fallback caso o produto não tenha tag visual mapeada
            const visual = primaveraTags[product.id] ?? { 
              tag: 'PRIMAVERA', 
              tagColor: theme.colors.primary 
            };

            return (
              <TouchableOpacity 
                key={product.id}
                style={styles.productCard}
                onPress={() => router.push(`/produto/${product.id}`)}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  <Image source={product.image} style={styles.productImage} />
                  <View style={[styles.tagBadge, { backgroundColor: visual.tagColor }]}>
                    <Text style={styles.tagText}>{visual.tag}</Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={[styles.categoryText, { color: visual.tagColor }]}>
                    {product.category.toUpperCase()}
                  </Text>
                  <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                    <TouchableOpacity 
                      style={[styles.addButton, { borderColor: visual.tagColor }]}
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
                      <MaterialIcons name="add" size={20} color={visual.tagColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
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