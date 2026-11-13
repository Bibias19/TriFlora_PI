import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { productsData } from '../data/products';

const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const promosData = [
  {
    ...productsData[0],
    oldPrice: 274.90,
    discount: '-20%',
  },
  {
    ...productsData[5],
    oldPrice: 306.25,
    discount: '-20%',
  },
  {
    ...productsData[8],
    oldPrice: 361.25,
    discount: '-20%',
  },
  {
    ...productsData[9],
    oldPrice: 562.50,
    discount: '-20%',
  }
];

export default function Promocoes() {
  const [searchText, setSearchText] = useState('');
  const { addItem } = useCart();

  const filteredPromos = promosData.filter(product => {
    const normalizedSearch = normalizeString(searchText);
    const normalizedProductName = normalizeString(product.name);
    return normalizedProductName.includes(normalizedSearch);
  });

  const isSearching = searchText.length > 0;

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Saudação */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingSmall}>OFERTAS ESPECIAIS</Text>
            <Text style={styles.greetingLarge}>Olá, Sofia</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={22} color={theme.colors.primary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Barra de Busca */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={theme.colors.textOutline} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar promoções..."
              placeholderTextColor={theme.colors.textOutline}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText !== '' && (
              <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); }}>
                <MaterialIcons name="close" size={20} color={theme.colors.textOutline} />
              </TouchableOpacity>
            )}
          </View>

          {isSearching && (
            <View style={styles.searchOverlay}>
              {filteredPromos.length > 0 ? (
                <ScrollView nestedScrollEnabled style={{ maxHeight: 250 }}>
                  {filteredPromos.map(prod => (
                    <TouchableOpacity 
                      key={prod.id} 
                      style={styles.searchResultItem}
                      onPress={() => { setSearchText(''); Keyboard.dismiss(); router.push(`/produto/${prod.id}`); }}
                    >
                      <Image source={{ uri: prod.image }} style={styles.searchResultImg} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.searchResultName}>{prod.name}</Text>
                        <Text style={styles.searchResultPrice}>R$ {prod.price.toFixed(2).replace('.', ',')}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noResultsBox}>
                  <MaterialIcons name="search-off" size={24} color={theme.colors.error} />
                  <Text style={styles.noResultsText}>Nenhuma promoção encontrada.</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Título da Página */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Semana Especial</Text>
          <Text style={styles.subtitle}>Aproveite descontos exclusivos em nossos produtos.</Text>
        </View>

        {/* Lista de Promoções */}
        <View style={styles.promoListContainer}>
          {filteredPromos.map((product) => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.promoCard} 
              onPress={() => router.push(`/produto/${product.id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.promoImageContainer}>
                <Image source={{ uri: product.image }} style={styles.promoImage} />
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.discount}</Text>
                </View>
              </View>
              
              <View style={styles.promoInfo}>
                <Text style={styles.promoCategory}>{product.category.toUpperCase()}</Text>
                <Text style={styles.promoName}>{product.name}</Text>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.oldPrice}>R$ {product.oldPrice.toFixed(2).replace('.', ',')}</Text>
                  <Text style={styles.newPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                </View>

                {/* BOTÕES DE AÇÃO - EM LARANJA */}
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.viewMoreButton}
                    onPress={() => router.push(`/produto/${product.id}`)}
                  >
                    <Text style={styles.viewMoreText}>Ver mais</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addButtonCircle}
                    onPress={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        type: 'product'
                      });
                      router.push('/(tabs)/carrinho');
                    }}
                  >
                    <MaterialIcons name="add" size={20} color={theme.colors.terracotta} />
                  </TouchableOpacity>
                </View>

              </View>
            </TouchableOpacity>
          ))}

          {filteredPromos.length === 0 && (
            <View style={styles.emptyResults}>
              <MaterialIcons name="search-off" size={48} color={theme.colors.textOutline} />
              <Text style={styles.emptyResultsText}>Nenhuma promoção encontrada.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24, paddingTop: 16 },
  
  greetingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.margin, marginTop: 0, zIndex: 1 },
  greetingSmall: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.terracotta, letterSpacing: 1.5 },
  greetingLarge: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary },
  notificationButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  notificationDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.rosyRed },

  searchWrapper: { position: 'relative', zIndex: 10, marginTop: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, paddingHorizontal: 16, height: 50, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.border },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textPrimary },
  
  searchOverlay: { 
    position: 'absolute', top: 55, left: theme.spacing.margin, right: theme.spacing.margin, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, zIndex: 20
  },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainer },
  searchResultImg: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  searchResultName: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.primary },
  searchResultPrice: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

  noResultsBox: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  noResultsText: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.error, marginLeft: 8 },

  // MARGEM INFERIOR AUMENTADA
  titleContainer: { paddingHorizontal: theme.spacing.margin, marginTop: 16, marginBottom: 40 },
  title: { fontFamily: theme.fonts.title, fontSize: 26, color: theme.colors.primary, marginBottom: 4 },
  subtitle: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary },

  promoListContainer: { paddingHorizontal: theme.spacing.margin },
  promoCard: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.radius.md, 
    marginBottom: 16, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  promoImageContainer: { width: 120, height: 160, position: 'relative' },
  promoImage: { width: '100%', height: '100%' },
  discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: theme.colors.terracotta, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  discountText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.white },
  
  promoInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  promoCategory: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.rosyRed, letterSpacing: 1, marginBottom: 4 },
  promoName: { fontFamily: theme.fonts.title, fontSize: 16, color: theme.colors.primary, marginBottom: 8 },
  
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  oldPrice: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline, textDecorationLine: 'line-through' },
  newPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 18, color: theme.colors.terracotta },
  
  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  
  viewMoreButton: { 
    backgroundColor: 'rgba(242, 140, 75, 0.12)',
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewMoreText: { 
    fontFamily: theme.fonts.bodyBold, 
    fontSize: 12, 
    color: theme.colors.terracotta
  },
  
  addButtonCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.terracotta,
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  emptyResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyResultsText: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.textSecondary, marginTop: 12 },
});