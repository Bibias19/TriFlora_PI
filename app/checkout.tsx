import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';

// ---- Tipos ----
interface Address {
  title: string;
  street: string;
  city: string;
  cep: string;
}

interface Card {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
}

interface CheckoutNotice {
  title: string;
  message: string;
  onConfirm?: () => void;
  kind: 'info' | 'success';
  amount?: string;
}

// ---- Dados iniciais ----
const INITIAL_ADDRESS: Address = {
  title: 'Residencial Jardins',
  street: 'Alameda das Hortênsias, 420 - Jardins',
  city: 'São Paulo - SP',
  cep: 'CEP 01423-001',
};

const INITIAL_CARD: Card = {
  id: 'card-1',
  brand: 'Mastercard',
  last4: '4829',
  expiry: '08/28',
};

// Chave demonstrativa para o TCC; substitua por uma chave PIX real para receber pagamentos.
const PIX_KEY = 'triflora-demo-pix-key';
const PIX_PIN = '482913';

const pixField = (id: string, value: string) =>
  `${id}${String(value.length).padStart(2, '0')}${value}`;

const calculatePixCrc = (payload: string) => {
  let crc = 0xffff;

  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const buildPixCode = (amount: number) => {
  const merchantAccount = `${pixField('00', 'br.gov.bcb.pix')}${pixField('01', PIX_KEY)}`;
  const additionalData = pixField('05', '***');
  const payload = [
    pixField('00', '01'),
    pixField('26', merchantAccount),
    pixField('52', '0000'),
    pixField('53', '986'),
    pixField('54', amount.toFixed(2)),
    pixField('58', 'BR'),
    pixField('59', 'TRIFLORA'),
    pixField('60', 'SAO PAULO'),
    pixField('62', additionalData),
    '6304',
  ].join('');

  return `${payload}${calculatePixCrc(payload)}`;
};

export default function Checkout() {
  const { 
    items, 
    subtotal, 
    clearCart, 
    hasVase, 
    vasePrice, 
    couponApplied, 
    couponDiscount, 
    finalTotal,
  } = useCart();

  // ---- Estados gerais ----
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [address, setAddress] = useState<Address>(INITIAL_ADDRESS);
  const [cards, setCards] = useState<Card[]>([INITIAL_CARD]);
  const [selectedCardId, setSelectedCardId] = useState<string>(INITIAL_CARD.id);
  
  // Modais
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [deliveryPeriod, setDeliveryPeriod] = useState<'morning' | 'afternoon'>('morning');
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);
  
  // ---- Formulário de endereço ----
  const [formTitle, setFormTitle] = useState(address.title);
  const [formCep, setFormCep] = useState(address.cep.replace(/\D/g, ''));
  const [formStreet, setFormStreet] = useState(address.street);
  const [formNeighborhood, setFormNeighborhood] = useState('');
  const [formCity, setFormCity] = useState(address.city);
  const [formNumber, setFormNumber] = useState('');
  const [formComplement, setFormComplement] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // ---- Formulário de cartão ----
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // ---- Cálculos ----
  const discount = paymentMethod === 'pix' ? finalTotal * 0.05 : 0;
  const total = Math.max(0, finalTotal - discount);
  const pixCode = buildPixCode(total);
  
  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const showNotice = (
    title: string,
    message: string,
    onConfirm?: () => void,
    details: Pick<CheckoutNotice, 'kind' | 'amount'> = { kind: 'info' }
  ) => {
    setNotice({ title, message, onConfirm, ...details });
  };

  const handleNoticeConfirm = () => {
    const onConfirm = notice?.onConfirm;
    setNotice(null);
    onConfirm?.();
  };

  // ---- Handlers de endereço ----
  const openAddressModal = () => {
    setFormTitle(address.title);
    setFormStreet(address.street);
    setFormCity(address.city);
    setFormCep(address.cep.replace(/\D/g, ''));
    setFormNeighborhood('');
    setFormNumber('');
    setFormComplement('');
    setIsAddressModalOpen(true);
  };

  const handleSearchCep = async () => {
    const cleanCep = formCep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      showNotice('CEP inválido', 'Digite um CEP com 8 dígitos.');
      return;
    }

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showNotice('CEP não encontrado', 'Verifique o CEP e tente novamente.');
        return;
      }

      setFormStreet(data.logradouro || '');
      setFormNeighborhood(data.bairro || '');
      setFormCity(`${data.localidade} - ${data.uf}`);
    } catch (error) {
      showNotice('Erro de conexão', 'Não foi possível buscar o CEP. Verifique sua internet.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSaveAddress = () => {
    if (!formStreet || !formCity || !formCep || !formNumber) {
      showNotice('Atenção', 'Preencha o CEP, número, rua e cidade.');
      return;
    }
    
    const fullStreet = `${formStreet}, ${formNumber}${formComplement ? ` - ${formComplement}` : ''}${formNeighborhood ? ` - ${formNeighborhood}` : ''}`;
    const formattedCep = `CEP ${formCep.slice(0, 5)}-${formCep.slice(5)}`;
    
    setAddress({
      title: formTitle || 'Meu endereço',
      street: fullStreet,
      city: formCity,
      cep: formattedCep,
    });
    setIsAddressModalOpen(false);
  };

  // ---- Handlers de cartão ----
  const handleAddCard = () => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const cleanExpiry = cardExpiry.replace(/\D/g, '');
    const cleanCvv = cardCvv.replace(/\D/g, '');
    const expiryMonth = Number(cleanExpiry.slice(0, 2));
    if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      showNotice('Atenção', 'Preencha todos os campos do cartão.');
      return;
    }
    if (cleanNumber.length < 13 || cleanNumber.length > 19 || cardName.trim().length < 3 ||
      cleanExpiry.length !== 4 || expiryMonth < 1 || expiryMonth > 12 ||
      (cleanCvv.length !== 3 && cleanCvv.length !== 4)) {
      showNotice('Atenção', 'Preencha todos os dados do cartão corretamente.');
      return;
    }
    const newCard: Card = {
      id: `card-${Date.now()}`,
      brand: cleanNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: cleanNumber.slice(-4),
      expiry: `${cleanExpiry.slice(0, 2)}/${cleanExpiry.slice(2)}`,
    };
    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    setCardNumber(''); setCardName(''); setCardExpiry(''); setCardCvv('');
    setIsCardModalOpen(false);
  };

  // ---- Handlers PIX ----
  const handleCopyPix = async () => {
    try {
      await Clipboard.setStringAsync(pixCode);
      showNotice('Código copiado', 'O código PIX demonstrativo foi copiado.');
    } catch {
      showNotice('Erro', 'Não foi possível copiar o código PIX.');
    }
  };

  // ---- Finalização ----
  const handleFinishOrder = () => {
    if (items.length === 0) {
      showNotice('Carrinho vazio', 'Adicione um produto antes de finalizar o pedido.');
      return;
    }

    if (paymentMethod === 'pix') {
      setIsPixModalOpen(true);
      return;
    }

    showNotice(
      'Pedido Confirmado',
      `Seu pedido de ${formatPrice(total)} foi realizado com sucesso e logo as flores sairão para entrega.`,
      () => {
        clearCart();
        router.push('/');
      },
      { kind: 'success', amount: formatPrice(total) }
    );
  };

  const handleConfirmPix = () => {
    setIsPixModalOpen(false);
    showNotice(
      'Pagamento PIX Confirmado',
      `Seu pedido de ${formatPrice(total)} foi realizado. Você receberá a confirmação em instantes.`,
      () => {
        clearCart();
        router.push('/');
      },
      { kind: 'success', amount: formatPrice(total) }
    );
  };

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Stepper */}
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
            <TouchableOpacity onPress={openAddressModal}>
              <Text style={styles.editText}>Alterar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressBox}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressTitle}>{address.title}</Text>
              <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>Principal</Text></View>
            </View>
            <Text style={styles.addressText}>{address.street}</Text>
            <Text style={styles.addressSubText}>{address.city} • {address.cep}</Text>
          </View>
        </View>

        {/* Data e Horário */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Data & Horário</Text>
          </View>
          
          <TouchableOpacity
            style={deliveryPeriod === 'morning' ? styles.deliveryOptionActive : styles.deliveryOption}
            onPress={() => setDeliveryPeriod('morning')}
          >
            <View style={deliveryPeriod === 'morning' ? styles.radioActive : styles.radioInactive}>
              {deliveryPeriod === 'morning' && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.deliveryTitle}>Hoje pela manhã (08h às 12h)</Text>
              <Text style={styles.deliveryDesc}>Flores orvalhadas entregues em água mineral</Text>
            </View>
            <Text style={styles.deliveryPrice}>Grátis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={deliveryPeriod === 'afternoon' ? styles.deliveryOptionActive : styles.deliveryOption}
            onPress={() => setDeliveryPeriod('afternoon')}
          >
            <View style={deliveryPeriod === 'afternoon' ? styles.radioActive : styles.radioInactive}>
              {deliveryPeriod === 'afternoon' && <View style={styles.radioInner} />}
            </View>
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

          {cards.map(card => (
            <TouchableOpacity 
              key={card.id}
              style={[styles.paymentOption, paymentMethod === 'card' && selectedCardId === card.id && styles.paymentOptionActive]}
              onPress={() => { setPaymentMethod('card'); setSelectedCardId(card.id); }}
            >
              <View style={paymentMethod === 'card' && selectedCardId === card.id ? styles.radioActive : styles.radioInactive}>
                {paymentMethod === 'card' && selectedCardId === card.id && <View style={styles.radioInner} />}
              </View>
              <MaterialIcons name="credit-card" size={24} color={theme.colors.primary} style={{ marginLeft: 12, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>{card.brand} •••• {card.last4}</Text>
                <Text style={styles.paymentDesc}>Expira em {card.expiry}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addCardButton} onPress={() => setIsCardModalOpen(true)}>
            <MaterialIcons name="add" size={20} color={theme.colors.primary} />
            <Text style={styles.addCardText}>Adicionar novo cartão</Text>
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

        {/* Itens */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Itens Selecionados</Text>
            <Text style={styles.itemCount}>{items.length} itens</Text>
          </View>
          
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemQty}>Qtd: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Resumo */}
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

          {hasVase && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vaso de Cerâmica</Text>
              <Text style={styles.summaryValue}>+ {formatPrice(vasePrice)}</Text>
            </View>
          )}

          {couponApplied && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelDiscount}>Cupom PRIMEIRAFLOR</Text>
              <Text style={styles.summaryValueDiscount}>- {formatPrice(couponDiscount)}</Text>
            </View>
          )}

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

      {/* Botão Finalizar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleFinishOrder}>
          <MaterialIcons name="lock" size={20} color={theme.colors.white} />
          <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
          <Text style={styles.checkoutButtonPrice}>• {formatPrice(total)}</Text>
        </TouchableOpacity>
      </View>

      {/* ---- MODAL: ALTERAR ENDEREÇO (com busca de CEP) ---- */}
      <Modal visible={isAddressModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Alterar Endereço</Text>
              <TouchableOpacity onPress={() => setIsAddressModalOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Título do endereço</Text>
              <TextInput 
                style={styles.input} 
                value={formTitle} 
                onChangeText={setFormTitle} 
                placeholder="Ex: Casa, Trabalho" 
              />

              {/* CEP com botão de busca */}
              <Text style={styles.inputLabel}>CEP</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput 
                  style={[styles.input, { flex: 1 }]} 
                  value={formCep} 
                  onChangeText={(text) => setFormCep(text.replace(/\D/g, '').slice(0, 8))} 
                  placeholder="00000000" 
                  keyboardType="numeric"
                  maxLength={8}
                  onBlur={handleSearchCep}
                />
                <TouchableOpacity 
                  style={styles.cepSearchButton} 
                  onPress={handleSearchCep}
                  disabled={isLoadingCep}
                >
                  {isLoadingCep ? (
                    <ActivityIndicator color={theme.colors.white} size="small" />
                  ) : (
                    <MaterialIcons name="search" size={20} color={theme.colors.white} />
                  )}
                </TouchableOpacity>
              </View>
              {isLoadingCep && (
                <Text style={styles.cepHint}>Buscando endereço...</Text>
              )}

              <Text style={styles.inputLabel}>Rua</Text>
              <TextInput 
                style={styles.input} 
                value={formStreet} 
                onChangeText={setFormStreet} 
                placeholder="Preenchido automaticamente" 
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Número</Text>
                  <TextInput 
                    style={styles.input} 
                    value={formNumber} 
                    onChangeText={setFormNumber} 
                    placeholder="123" 
                    keyboardType="numeric" 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Complemento</Text>
                  <TextInput 
                    style={styles.input} 
                    value={formComplement} 
                    onChangeText={setFormComplement} 
                    placeholder="Apto 42" 
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Bairro</Text>
              <TextInput 
                style={styles.input} 
                value={formNeighborhood} 
                onChangeText={setFormNeighborhood} 
                placeholder="Preenchido automaticamente" 
              />

              <Text style={styles.inputLabel}>Cidade - Estado</Text>
              <TextInput 
                style={styles.input} 
                value={formCity} 
                onChangeText={setFormCity} 
                placeholder="Preenchido automaticamente" 
              />

              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveAddress}>
                <Text style={styles.modalSaveText}>Salvar Endereço</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ---- MODAL: ADICIONAR CARTÃO ---- */}
      <Modal visible={isCardModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Cartão</Text>
              <TouchableOpacity onPress={() => setIsCardModalOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Número do cartão</Text>
              <TextInput 
                style={styles.input} 
                value={cardNumber} 
                onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').slice(0, 19))} 
                placeholder="Somente números" 
                keyboardType="numeric"
                maxLength={19}
              />

              <Text style={styles.inputLabel}>Nome impresso no cartão</Text>
              <TextInput 
                style={styles.input} 
                value={cardName} 
                onChangeText={setCardName} 
                placeholder="Como está no cartão" 
                autoCapitalize="characters" 
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Validade</Text>
                  <TextInput 
                    style={styles.input} 
                    value={cardExpiry} 
                    onChangeText={(text) => {
                      const digits = text.replace(/\D/g, '').slice(0, 4);
                      setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                    }} 
                    placeholder="MM/AA" 
                    keyboardType="numeric"
                    maxLength={5} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput 
                    style={styles.input} 
                    value={cardCvv} 
                    onChangeText={(text) => setCardCvv(text.replace(/\D/g, '').slice(0, 4))} 
                    placeholder="123" 
                    keyboardType="numeric" 
                    maxLength={4} 
                    secureTextEntry 
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.modalSaveButton} onPress={handleAddCard}>
                <Text style={styles.modalSaveText}>Adicionar Cartão</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ---- MODAL: PIX (QR CODE + CÓDIGO + PIN) ---- */}
      <Modal visible={isPixModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pagamento PIX</Text>
              <TouchableOpacity onPress={() => setIsPixModalOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
              <Text style={styles.pixInstructions}>
                Escaneie o QR Code demonstrativo ou copie o código PIX. Este código não recebe pagamentos reais.
              </Text>

              <View style={styles.qrContainer}>
                <QRCode 
                  value={pixCode} 
                  size={200} 
                  color={theme.colors.primary}
                  backgroundColor={theme.colors.white}
                />
              </View>

              <Text style={styles.inputLabel}>Código PIX (Copia e Cola)</Text>
              <View style={styles.pixCodeBox}>
                <Text style={styles.pixCodeText} selectable>{pixCode}</Text>
              </View>

              <TouchableOpacity style={styles.copyButton} onPress={handleCopyPix}>
                <MaterialIcons name="content-copy" size={18} color={theme.colors.white} />
                <Text style={styles.copyButtonText}>Copiar Código PIX</Text>
              </TouchableOpacity>

              <View style={styles.pinBox}>
                <MaterialIcons name="lock" size={18} color={theme.colors.primary} />
                <Text style={styles.pinLabel}>PIN de confirmação:</Text>
                <Text style={styles.pinValue}>{PIX_PIN}</Text>
              </View>
              <Text style={styles.pinHint}>
                Em um app real, o PIN seria enviado por SMS ou e-mail. Este é apenas um PIN demonstrativo.
              </Text>

              <TouchableOpacity style={styles.confirmPixButton} onPress={handleConfirmPix}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.white} />
                <Text style={styles.confirmPixText}>Confirmar Pagamento</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={notice !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setNotice(null)}
      >
        <View style={styles.noticeOverlay}>
          <View style={[styles.noticeCard, notice?.kind === 'success' && styles.successNoticeCard]}>
            <View style={[styles.noticeIcon, notice?.kind === 'success' && styles.successNoticeIcon]}>
              <MaterialIcons
                name={notice?.kind === 'success' ? 'local-florist' : 'spa'}
                size={notice?.kind === 'success' ? 38 : 30}
                color={notice?.kind === 'success' ? theme.colors.floralPink : theme.colors.primary}
              />
              {notice?.kind === 'success' && (
                <View style={styles.noticeSuccessBadge}>
                  <MaterialIcons name="check" size={15} color={theme.colors.white} />
                </View>
              )}
            </View>
            {notice?.kind === 'success' && (
              <Text style={styles.noticeEyebrow}>COM CARINHO, TRIFLORA</Text>
            )}
            <Text style={styles.noticeTitle}>{notice?.title}</Text>
            <Text style={styles.noticeMessage}>{notice?.message}</Text>
            {notice?.amount && (
              <View style={styles.noticeAmountBox}>
                <Text style={styles.noticeAmountLabel}>Total do pedido</Text>
                <Text style={styles.noticeAmount}>{notice.amount}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.noticeButton, notice?.kind === 'success' && styles.successNoticeButton]}
              onPress={handleNoticeConfirm}
              accessibilityRole="button"
            >
              <Text style={styles.noticeButtonText}>
                {notice?.onConfirm ? 'Voltar ao Início' : 'Entendi'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addCardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.primary, borderRadius: theme.radius.sm, marginBottom: 8 },
  addCardText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginLeft: 6 },

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

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, padding: 16, paddingBottom: 24, borderTopWidth: 1, borderColor: theme.colors.border },
  checkoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, paddingHorizontal: 20 },
  checkoutButtonText: { flex: 1, textAlign: 'center', fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white },
  checkoutButtonPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.white },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalContent: { maxHeight: '92%', backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.lg, borderTopRightRadius: theme.radius.lg, padding: 20, paddingBottom: 32 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  noticeOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(28, 38, 30, 0.48)' },
  noticeCard: { width: '100%', maxWidth: 380, alignItems: 'center', backgroundColor: theme.colors.surface, padding: 24, borderRadius: 32, borderWidth: 1, borderColor: theme.colors.border, elevation: 8 },
  successNoticeCard: { backgroundColor: '#FFF2F5', borderColor: theme.colors.floralPink, borderWidth: 2 },
  noticeIcon: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, borderRadius: 28, marginBottom: 14 },
  successNoticeIcon: { width: 76, height: 76, borderRadius: 38, marginBottom: 12, position: 'relative' },
  noticeSuccessBadge: { position: 'absolute', right: -2, bottom: -2, width: 25, height: 25, borderRadius: 13, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.secondary, borderWidth: 2, borderColor: theme.colors.surface },
  noticeEyebrow: { fontFamily: theme.fonts.bodyBold, fontSize: 10, letterSpacing: 1, color: theme.colors.secondary, marginBottom: 6 },
  noticeTitle: { fontFamily: theme.fonts.title, fontSize: 21, color: theme.colors.primary, textAlign: 'center' },
  noticeMessage: { fontFamily: theme.fonts.body, fontSize: 14, lineHeight: 21, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 10 },
  noticeAmountBox: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, borderRadius: theme.radius.sm, padding: 14, marginTop: 18 },
  noticeAmountLabel: { fontFamily: theme.fonts.bodyMedium, fontSize: 13, color: theme.colors.textSecondary },
  noticeAmount: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.primary },
  noticeButton: { width: '100%', height: 48, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 24, marginTop: 22 },
  successNoticeButton: { backgroundColor: theme.colors.floralPink, marginTop: 18 },
  noticeButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white },
  inputLabel: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.primary, marginTop: 10, marginBottom: 6 },
  input: { height: 46, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, paddingHorizontal: 12, color: theme.colors.primary, backgroundColor: theme.colors.surfaceContainer },
  cepSearchButton: { width: 46, height: 46, borderRadius: theme.radius.sm, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  cepHint: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary, marginTop: 6 },
  modalSaveButton: { height: 50, borderRadius: 25, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  modalSaveText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white },

  pixInstructions: { fontFamily: theme.fonts.body, fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  qrContainer: { padding: 16, backgroundColor: theme.colors.white, borderRadius: theme.radius.md, marginBottom: 12 },
  pixCodeBox: { width: '100%', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, backgroundColor: theme.colors.surfaceContainer, padding: 12 },
  pixCodeText: { fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.textSecondary },
  copyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, width: '100%', borderRadius: 22, backgroundColor: theme.colors.primary, marginTop: 12 },
  copyButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.white, marginLeft: 8 },
  pinBox: { flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: theme.radius.sm, backgroundColor: theme.colors.primaryFixed, padding: 12, marginTop: 16 },
  pinLabel: { flex: 1, fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.primary, marginLeft: 8 },
  pinValue: { fontFamily: theme.fonts.bodyBold, fontSize: 16, color: theme.colors.primary },
  pinHint: { fontFamily: theme.fonts.body, fontSize: 10, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },
  confirmPixButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, width: '100%', borderRadius: 24, backgroundColor: theme.colors.secondary, marginTop: 16 },
  confirmPixText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, marginLeft: 8 },
});