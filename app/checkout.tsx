import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  const discount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const handleFinishOrder = () => {
    if (items.length === 0) return;

    // Simulação de finalização de pedido
    Alert.alert(
      "Pedido Confirmado! 🌸",
      "Seu pedido foi realizado com sucesso e logo as flores sairão para entrega.",
      [
        { 
          text: "Voltar ao Início", 
          onPress: () => {
            clearCart(); // Limpa o carrinho
            router.push('/'); // Volta para a Home
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stepper de Progresso */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepRow}>
            <View style={styles.stepActive}><Text style={styles.stepTextActive}>1</Text></View>
            <Text style={styles.stepLabelActive}>Endereço</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepRow}>
            <View style={styles.stepActive}><Text style={styles.stepTextActive}>2</Text></View>
            <Text style={styles.stepLabelActive}>Entrega</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepRow}>
            <View style={styles.stepActive}><Text style={styles.stepTextActive}>3</Text></View>
            <Text style={styles.stepLabelActive}>Pagamento</Text>
          </View>
        </View>

        {/* Endereço */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Local de Entrega</Text>
            </View>
            <TouchableOpacity><Text style={styles.editText}>Alterar</Text></TouchableOpacity>
          </View>
          <View style={styles.addressBox}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressTitle}>Residencial Jardins</Text>
              <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>Principal</Text></View>
            </View>
            <Text style={styles.addressText}>Alameda das Hortênsias, 420 - Jardins</Text>
            <Text style={styles.addressSubText}>São Paulo - SP • CEP 01423-001</Text>
          </View>
        </View>

        {/* Data e Horário */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Data & Horário</Text>
          </View>
          
          <TouchableOpacity style={styles.deliveryOptionActive}>
            <View style={styles.radioActive}><View style={styles.radioInner} /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.deliveryTitle}>Hoje pela manhã (08h às 12h)</Text>
              <Text style={styles.deliveryDesc}>Flores orvalhadas entregues em água mineral</Text>
            </View>
            <Text style={styles.deliveryPrice}>Grátis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deliveryOption}>
            <View style={styles.radioInactive} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.deliveryTitleInactive}>Hoje à tarde (14h às 18h)</Text>
              <Text style={styles.deliveryDesc}>Transporte refrigerado com cartão postal</Text>
            </View>
            <Text style={styles.deliveryPrice}>Grátis</Text>
          </TouchableOpacity>
        </View>

        {/* Forma de Pagamento */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialIcons name="payments" size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Forma de Pagamento</Text>
          </View>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={paymentMethod === 'card' ? styles.radioActive : styles.radioInactive}>
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
            <MaterialIcons name="credit-card" size={24} color={theme.colors.primary} style={{ marginLeft: 12, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentTitle}>Mastercard •••• 4829</Text>
              <Text style={styles.paymentDesc}>Expira em 08/28</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('pix')}
          >
            <View style={paymentMethod === 'pix' ? styles.radioActive : styles.radioInactive}>
              {paymentMethod === 'pix' && <View style={styles.radioInner} />}
            </View>
            <MaterialIcons name="qr-code-2" size={24} color={theme.colors.secondary} style={{ marginLeft: 12, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.paymentTitle}>PIX Instantâneo</Text>
                <View style={styles.pixBadge}><Text style={styles.pixBadgeText}>5% OFF</Text></View>
              </View>
              <Text style={styles.paymentDesc}>Aprovação imediata do lote floral</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Itens Selecionados */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Itens Selecionados</Text>
            <Text style={styles.itemCount}>{items.length} itens</Text>
          </View>
          
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemQty}>Qtd: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Resumo dos Valores */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo dos Valores</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal dos botânicos</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete de Ateliê</Text>
            <Text style={styles.summaryValueFree}>Grátis</Text>
          </View>

          {paymentMethod === 'pix' && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelDiscount}>Desconto PIX (5%)</Text>
              <Text style={styles.summaryValueDiscount}>- {formatPrice(discount)}</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.installmentsText}>ou até 3x de {formatPrice(total / 3)} sem juros</Text>
            </View>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Garantia */}
        <View style={styles.guaranteeBox}>
          <MaterialIcons name="verified" size={24} color={theme.colors.primary} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.guaranteeTitle}>Garantia Frescor Triflora</Text>
            <Text style={styles.guaranteeDesc}>Botões colhidos na data agendada com reposição garantida em 48h.</Text>
          </View>
        </View>

      </ScrollView>

      {/* Botão Finalizar Fixo */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleFinishOrder}>
          <MaterialIcons name="lock" size={20} color={theme.colors.white} />
          <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
          <Text style={styles.checkoutButtonPrice}>• {formatPrice(total)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 100, paddingHorizontal: theme.spacing.margin },
  
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: theme.colors.surfaceContainer, padding: 12, borderRadius: theme.radius.md, marginTop: 8, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepActive: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepTextActive: { color: theme.colors.white, fontSize: 12, fontFamily: theme.fonts.bodyBold },
  stepLabelActive: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginLeft: 6 },
  stepLine: { flex: 1, height: 2, backgroundColor: theme.colors.border, marginHorizontal: 8 },

  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontFamily: theme.fonts.title, fontSize: 18, color: theme.colors.primary, marginLeft: 8 },
  editText: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.secondary, textDecorationLine: 'underline' },

  addressBox: { backgroundColor: theme.colors.surfaceContainer, padding: 12, borderRadius: theme.radius.sm },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  addressTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  primaryBadge: { backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  primaryBadgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.primary },
  addressText: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary },
  addressSubText: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline, marginTop: 2 },

  deliveryOptionActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, padding: 12, borderRadius: theme.radius.sm, marginBottom: 8 },
  deliveryOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: theme.radius.sm, marginBottom: 8 },
  radioActive: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.white },
  radioInactive: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.textOutline },
  deliveryTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  deliveryTitleInactive: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.textSecondary },
  deliveryDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline, marginTop: 2 },
  deliveryPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.secondary },

  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: 'transparent', marginBottom: 8 },
  paymentOptionActive: { backgroundColor: theme.colors.surfaceContainer, borderColor: theme.colors.border },
  paymentTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  paymentDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline, marginTop: 2 },
  pixBadge: { backgroundColor: theme.colors.tertiary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginLeft: 8 },
  pixBadgeText: { fontFamily: theme.fonts.bodyBold, fontSize: 9, color: theme.colors.white },

  itemCount: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textOutline },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: theme.colors.surfaceContainer, padding: 8, borderRadius: theme.radius.sm },
  itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  itemName: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.primary },
  itemQty: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  itemPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textSecondary },
  summaryValue: { fontFamily: theme.fonts.bodyMedium, fontSize: 14, color: theme.colors.primary },
  summaryValueFree: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.secondary },
  summaryLabelDiscount: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.tertiary },
  summaryValueDiscount: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.tertiary },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  installmentsText: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  totalValue: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary, fontWeight: 'bold' },

  guaranteeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, padding: 16, borderRadius: theme.radius.md, marginBottom: 24 },
  guaranteeTitle: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  guaranteeDesc: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: theme.colors.border },
  checkoutButton: { flexDirection: 'row', backgroundColor: theme.colors.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  checkoutButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, textTransform: 'uppercase', marginHorizontal: 8 },
  checkoutButtonPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white },
});