import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '../../theme';
import { Header } from '../../components/Header';
import { productsData } from '../../data/products';
import { categoriesData } from '../../data/categories';

const normalizeString = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

export default function Index() {
  const params = useLocalSearchParams();
  
  const [searchText, setSearchText] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');

  useEffect(() => {
    if (params.filter) {
      setActiveFilter(params.filter as string);
    }
  }, [params.filter]);

  const filterOptions = ['Todos', ...categoriesData.map(c => c.name)];

  const filteredProducts = productsData.filter(product => {
    const normalizedSearch = normalizeString(searchText);
    const normalizedProductName = normalizeString(product.name);
    const matchesSearch = normalizedProductName.includes(normalizedSearch);
    const matchesFilter = activeFilter === 'Todos' || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const isSearching = searchText.length > 0;
  const isFiltering = activeFilter !== 'Todos';

  const estacaoProducts = filteredProducts.filter(p => p.category === 'Flores da Estação' || p.category === 'Assinatura Triflora');
  const gridProducts = filteredProducts.filter(p => p.category !== 'Flores da Estação' && p.category !== 'Assinatura Triflora');

  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
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

        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={theme.colors.textOutline} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar flores, lírios, arranjos..."
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
              {filteredProducts.length > 0 ? (
                <ScrollView nestedScrollEnabled style={{ maxHeight: 250 }}>
                  {filteredProducts.map(prod => (
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
                  <Text style={styles.noResultsText}>Nenhum produto encontrado.</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>COLEÇÃO DE OUTONO</Text>
            <Text style={styles.heroTitle}>Flores que conectam histórias</Text>
            {/* Botão ajustado: ao invés de ir para categorias, ele rola para baixo ou apenas foca nos produtos */}
            <TouchableOpacity style={styles.heroButton} onPress={() => { /* Aqui pode ser um scroll, por enquanto sem ação */ }}>
              <Text style={styles.heroButtonText}>Explorar Coleção</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {categoriesData.map((category, index) => {
            const chipColors = [theme.colors.leafGreen, theme.colors.floralPink, theme.colors.sunflower, theme.colors.terracotta, theme.colors.lavender, theme.colors.rosyRed];
            const chipColor = chipColors[index % chipColors.length];
            const isActive = activeFilter === category.name;

            return (
              <TouchableOpacity 
                key={category.id}
                style={[styles.chip, { borderColor: chipColor, backgroundColor: isActive ? chipColor : theme.colors.surface }]}
                onPress={() => setActiveFilter(category.name)}
              >
                <MaterialIcons name="spa" size={16} color={isActive ? theme.colors.white : chipColor} />
                <Text style={[styles.chipText, { color: isActive ? theme.colors.white : chipColor }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isFiltering ? (
          <View style={{ marginTop: 24 }}>
            <View style={styles.resultsHeader}>
              <TouchableOpacity onPress={() => setActiveFilter('Todos')}>
                <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <View style={styles.resultsTitleWrapper}>
                <Text style={[styles.sectionTag, { color: theme.colors.primary }]}>RESULTADOS</Text>
                <Text style={styles.sectionTitle}>{activeFilter}</Text>
              </View>
            </View>

            {filteredProducts.length > 0 ? (
              <View style={styles.gridContainer}>
                {filteredProducts.map((product) => (
                  <TouchableOpacity key={product.id} style={styles.gridCard} onPress={() => router.push(`/produto/${product.id}`)}>
                    <View style={styles.gridImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.gridImage} />
                    </View>
                    <Text style={[styles.gridTag, { color: theme.colors.primary }]}>{product.category.toUpperCase()}</Text>
                    <Text style={styles.gridName} numberOfLines={2}>{product.name}</Text>
                    <View style={styles.gridFooter}>
                      <Text style={styles.gridPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                      <View style={[styles.gridAddBtn, { backgroundColor: theme.colors.primary }]}>
                        <MaterialIcons name="add" size={18} color={theme.colors.white} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyResults}>
                <MaterialIcons name="search-off" size={48} color={theme.colors.textOutline} />
                <Text style={styles.emptyResultsText}>Nenhum produto nesta categoria.</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTag, { color: theme.colors.terracotta }]}>OPORTUNIDADES</Text>
                <Text style={styles.sectionTitle}>Semana Especial</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/promocoes')}> {/* Ajustado para futura tela de promoções */}
                <Text style={[styles.seeAllText, { color: theme.colors.terracotta }]}>Ver todas</Text>
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
              <Image source={{ uri: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=400&auto=format&fit=crop' }} style={styles.promoImage} />
            </View>

            {estacaoProducts.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={[styles.sectionTag, { color: theme.colors.floralPink }]}>COLHEITA MATINAL</Text>
                    <Text style={styles.sectionTitle}>Flores da Estação</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveFilter('Flores da Estação')}>
                    <Text style={[styles.seeAllText, { color: theme.colors.floralPink }]}>Ver todas</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {estacaoProducts.map((product) => (
                    <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push(`/produto/${product.id}`)}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                        <View style={[styles.addButton, { backgroundColor: theme.colors.floralPink }]}>
                          <MaterialIcons name="add" size={20} color={theme.colors.white} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {gridProducts.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={[styles.sectionTag, { color: theme.colors.rosyRed }]}>FAVORITOS DA CASA</Text>
                    <Text style={styles.sectionTitle}>Mais Vendidos</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveFilter('Mais Vendidos')}>
                    <Text style={[styles.seeAllText, { color: theme.colors.rosyRed }]}>Ver todos</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {gridProducts.map((product) => (
                    <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push(`/produto/${product.id}`)}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <Text style={styles.productName}>{product.name}</Text>
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                        <View style={[styles.addButton, { backgroundColor: theme.colors.rosyRed }]}>
                          <MaterialIcons name="add" size={20} color={theme.colors.white} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* AQUI ESTÁ A ANTIGA PÁGINA DE CATEGORIAS, AGORA NA HOME */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTag, { color: theme.colors.primary }]}>NAVEGUE POR</Text>
                <Text style={styles.sectionTitle}>Categorias Florais</Text>
              </View>
            </View>

            <View style={styles.categoryGridContainer}>
              {categoriesData.map((category) => (
                <TouchableOpacity 
                  key={category.id} 
                  style={styles.categoryCard}
                  onPress={() => setActiveFilter(category.name)}
                >
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

            <View style={styles.customBanner}>
              <View style={[styles.customIconBox, { backgroundColor: theme.colors.lavender }]}>
                <MaterialIcons name="local-florist" size={24} color={theme.colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.customTitle}>Deseja um arranjo sob medida?</Text>
                <Text style={styles.customDesc}>Nossos floristas parceiros criam uma composição exclusiva.</Text>
                <TouchableOpacity onPress={() => router.push('/monte-bouquet')}>
                  <Text style={[styles.customLink, { color: theme.colors.lavender }]}>Iniciar consultoria floral →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24, paddingTop: 32 },
  
  greetingContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.margin, marginTop: 0, zIndex: 1 },
  greetingSmall: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.leafGreen, letterSpacing: 1.5 },
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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainer },
  filterOptionActive: { backgroundColor: 'rgba(62,90,62,0.05)', borderRadius: 8, paddingHorizontal: 12 },
  filterOptionText: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.textSecondary },
  filterOptionTextActive: { fontFamily: theme.fonts.bodyBold, color: theme.colors.primary },

  heroBanner: { marginHorizontal: theme.spacing.margin, marginTop: 20, height: 200, borderRadius: theme.radius.lg, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(62,90,62,0.6)', padding: 20, justifyContent: 'flex-end' },
  heroTag: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primaryFixed, letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { fontFamily: theme.fonts.title, fontSize: 22, color: theme.colors.white, marginBottom: 12 },
  heroButton: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  heroButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 11, color: theme.colors.primary },

  chipsScroll: { marginTop: 20, paddingHorizontal: theme.spacing.margin, maxHeight: 40 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1.5 },
  chipText: { fontFamily: theme.fonts.bodyMedium, fontSize: 11, marginLeft: 6 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: theme.spacing.margin, marginTop: 24, marginBottom: 12 },
  sectionTag: { fontFamily: theme.fonts.bodyBold, fontSize: 9, letterSpacing: 1.5 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 18, color: theme.colors.primary },
  seeAllText: { fontFamily: theme.fonts.bodyMedium, fontSize: 11 },

  resultsHeader: { paddingHorizontal: theme.spacing.margin, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
  resultsTitleWrapper: { flex: 1, marginLeft: 12 },

  emptyResults: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyResultsText: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.textSecondary, marginTop: 12 },

  promoCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, borderRadius: theme.radius.md, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  promoInfo: { flex: 1 },
  promoTag: { backgroundColor: theme.colors.terracotta, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  promoTagText: { color: theme.colors.white, fontSize: 9, fontFamily: theme.fonts.bodyBold },
  promoTitle: { fontFamily: theme.fonts.title, fontSize: 15, color: theme.colors.primary },
  promoDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 4 },
  promoPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.primary },
  promoOldPrice: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textOutline, textDecorationLine: 'line-through' },
  promoImage: { width: 90, height: 90, borderRadius: theme.radius.md, marginLeft: 16 },

  horizontalScroll: { paddingLeft: theme.spacing.margin, marginBottom: 12 },
  productCard: { width: 140, marginRight: 16, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 10, borderWidth: 1, borderColor: theme.colors.border },
  productImage: { width: '100%', height: 120, borderRadius: theme.radius.sm, marginBottom: 8 },
  productName: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.primary },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.primary },
  addButton: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: theme.spacing.margin - 6, justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  gridImageContainer: { position: 'relative', width: '100%', height: 140, borderRadius: theme.radius.sm, overflow: 'hidden', marginBottom: 10 },
  gridImage: { width: '100%', height: '100%' },
  gridFavButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.8)', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridTag: { fontFamily: theme.fonts.bodyBold, fontSize: 8, letterSpacing: 1, marginBottom: 4 },
  gridName: { fontFamily: theme.fonts.title, fontSize: 14, color: theme.colors.primary, marginBottom: 2 },
  gridFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  gridPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  gridAddBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

  // ESTILOS DOS CARDS DE CATEGORIA (Trazidos da antiga página)
  categoryGridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: theme.spacing.margin - 6, justifyContent: 'space-between' },
  categoryCard: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  categoryImageContainer: { height: 120, width: '100%', position: 'relative' },
  categoryImage: { width: '100%', height: '100%' },
  optionsBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  optionsText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primary },
  categoryInfo: { padding: 12 },
  categoryTagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  categoryTag: { fontFamily: theme.fonts.bodyBold, fontSize: 8, letterSpacing: 1 },
  categoryName: { fontFamily: theme.fonts.title, fontSize: 14, color: theme.colors.primary, marginBottom: 4 },
  categoryDesc: { fontFamily: theme.fonts.body, fontSize: 10, color: theme.colors.textSecondary, lineHeight: 14 },

  customBanner: { flexDirection: 'row', backgroundColor: theme.colors.primaryFixed, marginHorizontal: theme.spacing.margin, padding: 16, borderRadius: theme.radius.md, marginTop: 12, alignItems: 'center' },
  customIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  customTitle: { fontFamily: theme.fonts.title, fontSize: 15, color: theme.colors.primary },
  customDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 4, lineHeight: 15 },
  customLink: { fontFamily: theme.fonts.bodyBold, fontSize: 11, marginTop: 8 },
});