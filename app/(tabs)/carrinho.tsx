import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { Header } from '../../components/Header';
import { useCart } from '../../context/CartContext';

export default function Carrinho() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  
  // Estados locais para os extras do carrinho
  const [hasCard, setHasCard] = useState(true);
  const [hasVase, setHasVase] = useState(false);
  const [coupon, setCoupon] = useState('PRIMEIRAFLOR');
  const [couponApplied, setCouponApplied] = useState(true);

  const vasePrice = 48.00;
  const couponDiscount = couponApplied ? 18.00 : 0.00;
  
  // Cálculos
  const finalTotal = subtotal + (hasVase ? vasePrice : 0) - couponDiscount;

  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'PRIMEIRAFLOR') {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Cabeçalho */}
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>Meu Carrinho</Text>
            <Text style={styles.subtitle}>{items.length} itens selecionados</Text>
          </View>
          <View style={styles.freshBadge}>
            <Text style={styles.freshBadgeText}>Frescor Ateliê</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="spa" size={48} color={theme.colors.textOutline} />
            <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.emptyText}>Explore nossas criações florais e monte seu arranjo.</Text>
            <TouchableOpacity style={styles.continueButton} onPress={() => router.push('/')}>
              <Text style={styles.continueButtonText}>Explorar Flores</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Lista de Itens */}
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemTag}>
                    <Text style={styles.itemTagText}>{item.type === 'custom_bouquet' ? 'Monte seu Bouquet' : 'Assinatura'}</Text>
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                  
                  <View style={styles.itemActions}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, -1)}>
                        <MaterialIcons name="remove" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, 1)}>
                        <MaterialIcons name="add" size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <MaterialIcons name="delete-outline" size={22} color={theme.colors.textOutline} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Toques Especiais */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Toques Especiais</Text>
                <Text style={styles.cardSubtitle}>Personalize seu presente</Text>
              </View>

              {/* Cartão Manuscrito */}
              <TouchableOpacity style={styles.addonRow} onPress={() => setHasCard(!hasCard)}>
                <View style={styles.addonLeft}>
                  <View style={[styles.addonIcon, { backgroundColor: 'rgba(229,106,140,0.1)' }]}>
                    <MaterialIcons name="edit-note" size={20} color={theme.colors.rose} />
                  </View>
                  <View>
                    <Text style={styles.addonTitle}>Cartão com Caligrafia Manual</Text>
                    <Text style={styles.addonDesc}>Mensagem afetuosa escrita à mão</Text>
                  </View>
                </View>
                <View style={styles.addonRight}>
                  <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>Grátis</Text></View>
                  <View style={hasCard ? styles.checkboxActive : styles.checkboxInactive}>
                    {hasCard && <MaterialIcons name="check" size={14} color={theme.colors.white} />}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Vaso Cerâmica */}
              <TouchableOpacity style={styles.addonRow} onPress={() => setHasVase(!hasVase)}>
                <View style={styles.addonLeft}>
                  <View style={[styles.addonIcon, { backgroundColor: 'rgba(240,122,58,0.1)' }]}>
                    <MaterialIcons name="coffee" size={20} color={theme.colors.tertiary} />
                  </View>
                  <View>
                    <Text style={styles.addonTitle}>Vaso Cerâmica Queimada</Text>
                    <Text style={styles.addonDesc}>Design orgânico terracota</Text>
                  </View>
                </View>
                <View style={styles.addonRight}>
                  <Text style={styles.addonPrice}>+ R$ 48,00</Text>
                  <View style={hasVase ? styles.checkboxActive : styles.checkboxInactive}>
                    {hasVase && <MaterialIcons name="check" size={14} color={theme.colors.white} />}
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cupom de Desconto */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name="sell" size={18} color={theme.colors.secondary} />
                  <Text style={[styles.cardTitle, { marginLeft: 6 }]}>Cupom de Desconto</Text>
                </View>
                {couponApplied && <Text style={styles.appliedText}>1 aplicado</Text>}
              </View>
              
              <View style={styles.couponInputRow}>
                <View style={styles.couponInputWrapper}>
                  <TextInput 
                    style={styles.couponInput}
                    value={coupon}
                    onChangeText={setCoupon}
                    placeholder="DIGITE AQUI"
                    autoCapitalize="characters"
                  />
                  {couponApplied && <MaterialIcons name="check-circle" size={20} color={theme.colors.secondary} />}
                </View>
                <TouchableOpacity style={styles.applyButton} onPress={applyCoupon}>
                  <Text style={styles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.couponSuggestion}>
                <Text style={styles.suggestionLabel}>Sugestão:</Text>
                <TouchableOpacity style={styles.suggestionBadge} onPress={() => { setCoupon('PRIMEIRAFLOR'); setCouponApplied(true); }}>
                  <Text style={styles.suggestionText}>PRIMEIRAFLOR ✨</Text>
                </TouchableOpacity>
                <Text style={styles.suggestionDesc}>Frete cortesia</Text>
              </View>
            </View>

            {/* Resumo dos Valores */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Resumo dos Valores</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal dos arranjos</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.summaryLabel}>Entrega Expressa Climatizada</Text>
                </View>
                <Text style={styles.summaryValueFree}>Grátis</Text>
              </View>

              {hasVase && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Vaso de Cerâmica</Text>
                  <Text style={styles.summaryValue}>+ R$ 48,00</Text>
                </View>
              )}

              {couponApplied && (
                <View style={styles.summaryRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.summaryLabelDiscount}>Desconto Boas-Vindas</Text>
                    <View style={styles.couponTag}><Text style={styles.couponTagText}>Cupom</Text></View>
                  </View>
                  <Text style={styles.summaryValueDiscount}>- {formatPrice(couponDiscount)}</Text>
                </View>
              )}

              <View style={styles.divider} />
              
              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.installmentsText}>ou até 3x de {formatPrice(finalTotal / 3)} sem juros</Text>
                </View>
                <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
              </View>
            </View>

            {/* Garantia */}
            <View style={styles.guaranteeBox}>
              <View style={styles.guaranteeIconBox}>
                <MaterialIcons name="verified" size={24} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.guaranteeTitle}>Frescor Garantido por 7 Dias</Text>
                <Text style={styles.guaranteeDesc}>Flores colhidas na madrugada, hidratadas em solução mineral e transportadas em embalagem 100% biodegradável.</Text>
              </View>
            </View>

            {/* Botão Checkout */}
            <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="lock" size={20} color={theme.colors.white} />
                <Text style={styles.checkoutButtonText}>Continuar para Compra</Text>
              </View>
              <View style={styles.checkoutPriceBadge}>
                <Text style={styles.checkoutButtonPrice}>{formatPrice(finalTotal)}</Text>
                <MaterialIcons name="arrow-forward" size={16} color={theme.colors.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.footerText}>🌱 Cultivo ético & produtores botânicos locais parceiros</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 24, paddingHorizontal: theme.spacing.margin },
  
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 20 },
  title: { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.primary },
  subtitle: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  freshBadge: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  freshBadgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary, textTransform: 'uppercase' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary, marginTop: 16 },
  emptyText: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  continueButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, marginTop: 24 },
  continueButtonText: { fontFamily: theme.fonts.bodyBold, color: theme.colors.white, fontSize: 14 },

  itemCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 12, marginBottom: 12 },
  itemImage: { width: 80, height: 80, borderRadius: theme.radius.sm, marginRight: 12 },
  itemInfo: { flex: 1, justifyContent: 'space-between' },
  itemTag: { backgroundColor: theme.colors.primaryFixed, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  itemTagText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primary },
  itemName: { fontFamily: theme.fonts.title, fontSize: 16, color: theme.colors.primary },
  itemPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.primary, marginTop: 4 },
  itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, borderRadius: 16, padding: 2 },
  qtyButton: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary, width: 24, textAlign: 'center' },

  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontFamily: theme.fonts.title, fontSize: 18, color: theme.colors.primary },
  cardSubtitle: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.secondary },
  appliedText: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline },

  addonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, padding: 12, borderRadius: theme.radius.sm, marginBottom: 8 },
  addonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  addonIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  addonTitle: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.primary },
  addonDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  addonRight: { flexDirection: 'row', alignItems: 'center' },
  freeBadge: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginRight: 8 },
  freeBadgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.primary },
  addonPrice: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.primary, marginRight: 8 },
  checkboxActive: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.rose, justifyContent: 'center', alignItems: 'center' },
  checkboxInactive: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: theme.colors.textOutline },

  couponInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  couponInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, borderRadius: 20, paddingHorizontal: 16, height: 40, marginRight: 8 },
  couponInput: { flex: 1, fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.primary },
  applyButton: { backgroundColor: theme.colors.primary, height: 40, paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center' },
  applyButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.white },
  couponSuggestion: { flexDirection: 'row', alignItems: 'center' },
  suggestionLabel: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginRight: 6 },
  suggestionBadge: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  suggestionText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary },
  suggestionDesc: { fontFamily: theme.fonts.bodyMedium, fontSize: 11, color: theme.colors.secondary },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  summaryLabel: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary },
  summaryValue: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.primary },
  summaryValueFree: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.secondary },
  summaryLabelDiscount: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.secondary },
  couponTag: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4, marginLeft: 6 },
  couponTagText: { fontFamily: theme.fonts.bodyBold, fontSize: 8, color: theme.colors.primary },
  summaryValueDiscount: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.secondary },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  installmentsText: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  totalValue: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary, fontWeight: 'bold' },

  guaranteeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, padding: 16, borderRadius: theme.radius.md, marginBottom: 20 },
  guaranteeIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primaryFixed, justifyContent: 'center', alignItems: 'center' },
  guaranteeTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  guaranteeDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2, lineHeight: 16 },

  checkoutButton: { flexDirection: 'row', backgroundColor: theme.colors.primary, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 8 },
  checkoutButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, textTransform: 'uppercase', marginLeft: 8 },
  checkoutPriceBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  checkoutButtonPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.white, marginRight: 4 },
  footerText: { fontFamily: theme.fonts.body, fontSize: 10, color: theme.colors.textOutline, textAlign: 'center', marginTop: 12 },
});