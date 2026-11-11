import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { theme } from '../../theme';
import { Header } from '../../components/Header';
import { productsData } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function ProdutoDetalhes() {
  const { id } = useLocalSearchParams();
  const product = productsData.find(p => p.id === id);
  
  // Estados locais
  const [quantity, setQuantity] = useState(1);
  const [hasVase, setHasVase] = useState(false);
  const [selectedImage, setSelectedImage] = useState(''); // Guarda a foto principal atual
  
  const { addItem } = useCart();

  if (!product) {
    return (
      <View style={styles.container}>
        <Header showBackButton />
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Produto não encontrado.</Text>
      </View>
    );
  }

  const vasePrice = 48.00;
  const totalPrice = (product.price * quantity) + (hasVase ? vasePrice : 0);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name + (hasVase ? ' (com Vaso)' : ''),
      price: product.price + (hasVase ? vasePrice : 0),
      image: product.image,
      type: 'product'
    });
    router.push('/carrinho');
  };

  // Filtra outros produtos para o carrossel (excluindo o produto atual)
  const relatedProducts = productsData.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Imagem Principal */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedImage || product.image }} 
            style={styles.mainImage} 
          />
          <View style={styles.badge}>
            <MaterialIcons name="local-florist" size={14} color={theme.colors.secondary} />
            <Text style={styles.badgeText}>EDIÇÃO LIMITADA</Text>
          </View>
        </View>

        {/* Miniaturas de Fotos (Galeria) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsScroll}>
          {product.images.map((imgUrl, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setSelectedImage(imgUrl)}
              style={[
                styles.thumbnailContainer, 
                (selectedImage === imgUrl || (!selectedImage && index === 0)) && styles.thumbnailActive
              ]}
            >
              <Image source={{ uri: imgUrl }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Informações do Produto */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>{product.category}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color={theme.colors.tertiary} />
              <Text style={styles.ratingText}>{product.rating} ({product.reviews} avaliações)</Text>
            </View>
          </View>
          
          <Text style={styles.productTitle}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.installmentText}>em até 3x sem juros</Text>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.sectionContainer}>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>

        {/* Significado das Flores */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="auto-awesome" size={20} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>Significado das Flores</Text>
          </View>
          {product.flowers.map((flower, index) => (
            <View key={index} style={styles.flowerCard}>
              <View style={[styles.flowerDot, { backgroundColor: flower.color }]} />
              <View style={styles.flowerInfo}>
                <Text style={styles.flowerName}>{flower.name}</Text>
                <Text style={styles.flowerMeaning}>{flower.meaning}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Personalização */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Personalize para Presente</Text>
          <TouchableOpacity 
            style={[styles.customizationBox, hasVase && styles.customizationBoxActive]} 
            onPress={() => setHasVase(!hasVase)}
          >
            <View style={styles.customizationLeft}>
              <MaterialIcons name="coffee" size={24} color={hasVase ? theme.colors.primary : theme.colors.textOutline} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.customizationTitle}>Vaso em Cerâmica Artesanal</Text>
                <Text style={styles.customizationPrice}>+ R$ 48,00</Text>
              </View>
            </View>
            <MaterialIcons 
              name={hasVase ? "check-circle" : "radio-button-unchecked"} 
              size={24} 
              color={hasVase ? theme.colors.primary : theme.colors.textOutline} 
            />
          </TouchableOpacity>
        </View>

        {/* Carrossel: Você também pode amar */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <Text style={styles.sectionTitle}>Você também pode amar</Text>
              <TouchableOpacity onPress={() => router.push('/categorias')}>
                <Text style={styles.seeAllText}>Ver Todos</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: theme.spacing.margin }}>
              {relatedProducts.map(relProduct => (
                <TouchableOpacity 
                  key={relProduct.id} 
                  style={styles.relatedCard}
                  onPress={() => router.push(`/produto/${relProduct.id}`)}
                >
                  <View style={styles.relatedImageContainer}>
                    <Image source={{ uri: relProduct.image }} style={styles.relatedImage} />
                  </View>
                  <Text style={styles.relatedName} numberOfLines={1}>{relProduct.name}</Text>
                  <Text style={styles.relatedPrice}>R$ {relProduct.price.toFixed(2).replace('.', ',')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

      </ScrollView>

      {/* Barra Fixa Inferior */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <MaterialIcons name="remove" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
            <MaterialIcons name="add" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <MaterialIcons name="shopping-bag" size={20} color={theme.colors.white} />
          <Text style={styles.addToCartText}>Adicionar</Text>
          <Text style={styles.addToCartPrice}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 100 },
  
  imageContainer: { marginHorizontal: theme.spacing.margin, marginTop: 8, height: 350, borderRadius: theme.radius.lg, overflow: 'hidden', position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary, marginLeft: 4, letterSpacing: 1 },

  thumbnailsScroll: { paddingHorizontal: theme.spacing.margin, marginTop: 12, marginBottom: 4 },
  thumbnailContainer: { width: 64, height: 64, borderRadius: theme.radius.sm, marginRight: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  thumbnailActive: { borderColor: theme.colors.primary },
  thumbnailImage: { width: '100%', height: '100%' },

  infoContainer: { paddingHorizontal: theme.spacing.margin, marginTop: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.secondary, textTransform: 'uppercase' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginLeft: 4 },
  productTitle: { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.primary, marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceText: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary, fontWeight: 'bold' },
  installmentText: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginLeft: 8 },

  sectionContainer: { paddingHorizontal: theme.spacing.margin, marginTop: 24 },
  descriptionBox: { backgroundColor: theme.colors.surfaceContainer, padding: 16, borderRadius: theme.radius.md },
  descriptionText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary, marginLeft: 8 },

  flowerCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.md, marginBottom: 8, alignItems: 'flex-start' },
  flowerDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4, marginRight: 12 },
  flowerInfo: { flex: 1 },
  flowerName: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  flowerMeaning: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

  customizationBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.md, borderWidth: 1, borderColor: 'transparent' },
  customizationBoxActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceContainer },
  customizationLeft: { flexDirection: 'row', alignItems: 'center' },
  customizationTitle: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.primary },
  customizationPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.secondary, marginTop: 2 },

  relatedSection: { marginTop: 32, marginBottom: 24 },
  relatedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.margin, marginBottom: 16 },
  seeAllText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.secondary },
  relatedCard: { width: 140, marginRight: 16, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 10 },
  relatedImageContainer: { width: '100%', height: 120, borderRadius: theme.radius.sm, overflow: 'hidden', marginBottom: 8 },
  relatedImage: { width: '100%', height: '100%' },
  relatedName: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.primary },
  relatedPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary, marginTop: 4 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, flexDirection: 'row', padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: theme.colors.border, alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, borderRadius: 25, padding: 4, marginRight: 16 },
  quantityButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.white, borderRadius: 18 },
  quantityText: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.primary, width: 30, textAlign: 'center' },
  addToCartButton: { flex: 1, flexDirection: 'row', backgroundColor: theme.colors.primary, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  addToCartText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, textTransform: 'uppercase' },
  addToCartPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white },
});