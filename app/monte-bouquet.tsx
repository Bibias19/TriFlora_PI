import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { flowersData, foliageData } from '../data/bouquetData';

export default function MonteBouquet() {
  const { addItem } = useCart();
  const [step, setStep] = useState(1);

  const [quantities, setQuantities] = useState<Record<string, number>>({
    lirio: 2, girassol: 3, peonia: 2, tulipa: 1
  });
  const [selectedFoliage, setSelectedFoliage] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState('kraft');

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const toggleFoliage = (id: string) => {
    setSelectedFoliage(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalStems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  let basePrice = 0;
  flowersData.forEach(flower => {
    basePrice += (quantities[flower.id] || 0) * flower.price;
  });
  
  let foliagePrice = 0;
  foliageData.forEach(foliage => {
    if (selectedFoliage.includes(foliage.id)) foliagePrice += foliage.price;
  });

  const packagingPrices = { kraft: 0, linho: 15, premium: 35 };
  const packagingPrice = packagingPrices[selectedPackaging as keyof typeof packagingPrices];
  
  const totalPrice = basePrice + foliagePrice + packagingPrice;

  const handleFinish = () => {
    addItem({
      id: `custom-${Date.now()}`,
      name: 'Arranjo Autoral Triflora',
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop',
      type: 'custom_bouquet'
    });
    router.push('/carrinho');
  };

  const renderStep1 = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Flores Principais</Text>
      <Text style={styles.sectionSubtitle}>Selecione os protagonistas do seu arranjo</Text>
      {flowersData.map(flower => (
        <View key={flower.id} style={styles.flowerCard}>
          <Image source={{ uri: flower.image }} style={styles.flowerImage} />
          <View style={styles.flowerInfo}>
            <Text style={styles.flowerName}>{flower.name}</Text>
            <Text style={styles.flowerPrice}>R$ {flower.price.toFixed(2).replace('.', ',')} <Text style={styles.perStem}>/ haste</Text></Text>
          </View>
          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterButton} onPress={() => updateQuantity(flower.id, -1)}>
              <MaterialIcons name="remove" size={18} color={theme.colors.white} />
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantities[flower.id] || 0}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={() => updateQuantity(flower.id, 1)}>
              <MaterialIcons name="add" size={18} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Folhagens</Text>
      <Text style={styles.sectionSubtitle}>Adicione textura e frescor natural ao buquê</Text>
      
      {/* Grid 2x2 de Folhagens */}
      <View style={styles.foliageGrid}>
        {foliageData.map(foliage => {
          const isSelected = selectedFoliage.includes(foliage.id);
          return (
            <TouchableOpacity 
              key={foliage.id} 
              style={[styles.foliageCard, isSelected && styles.foliageCardActive]}
              onPress={() => toggleFoliage(foliage.id)}
            >
              <View style={styles.foliageIcon}>
                <MaterialIcons name="eco" size={32} color={isSelected ? theme.colors.primary : theme.colors.textOutline} />
              </View>
              <Text style={styles.foliageName}>{foliage.name}</Text>
              <Text style={styles.foliagePrice}>+ R$ {foliage.price.toFixed(2).replace('.', ',')}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Embalagem</Text>
      <Text style={styles.sectionSubtitle}>Escolha como deseja envolver seu presente</Text>
      
      <TouchableOpacity style={[styles.packagingCard, selectedPackaging === 'kraft' && styles.packagingCardActive]} onPress={() => setSelectedPackaging('kraft')}>
        <MaterialIcons name="inventory-2" size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.packagingName}>Papel Kraft Natural</Text>
          <Text style={styles.packagingDesc}>Rústico e elegante</Text>
        </View>
        <Text style={styles.packagingPrice}>Grátis</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.packagingCard, selectedPackaging === 'linho' && styles.packagingCardActive]} onPress={() => setSelectedPackaging('linho')}>
        <MaterialIcons name="texture" size={24} color={theme.colors.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.packagingName}>Tecido de Linho</Text>
          <Text style={styles.packagingDesc}>Toque sofisticado</Text>
        </View>
        <Text style={styles.packagingPrice}>+ R$ 15,00</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.packagingCard, selectedPackaging === 'premium' && styles.packagingCardActive]} onPress={() => setSelectedPackaging('premium')}>
        <MaterialIcons name="auto-awesome" size={24} color={theme.colors.sunflower} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.packagingName}>Caixa Premium com Laço</Text>
          <Text style={styles.packagingDesc}>A experiência completa</Text>
        </View>
        <Text style={styles.packagingPrice}>+ R$ 35,00</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <View style={styles.stepperContainer}>
        <TouchableOpacity style={styles.stepRow} onPress={() => setStep(1)}>
          <View style={step >= 1 ? styles.stepActive : styles.stepInactive}><Text style={step >= 1 ? styles.stepTextActive : styles.stepTextInactive}>1</Text></View>
          <Text style={step >= 1 ? styles.stepLabelActive : styles.stepLabel}>Flores</Text>
        </TouchableOpacity>
        
        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
        
        <TouchableOpacity style={styles.stepRow} onPress={() => setStep(2)}>
          <View style={step >= 2 ? styles.stepActive : styles.stepInactive}><Text style={step >= 2 ? styles.stepTextActive : styles.stepTextInactive}>2</Text></View>
          <Text style={step >= 2 ? styles.stepLabelActive : styles.stepLabel}>Folhagens</Text>
        </TouchableOpacity>
        
        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
        
        <TouchableOpacity style={styles.stepRow} onPress={() => setStep(3)}>
          <View style={step >= 3 ? styles.stepActive : styles.stepInactive}><Text style={step >= 3 ? styles.stepTextActive : styles.stepTextInactive}>3</Text></View>
          <Text style={step >= 3 ? styles.stepLabelActive : styles.stepLabel}>Embalagem</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.visualPanel}>
          <View style={styles.stemCounter}>
            <MaterialIcons name="local-florist" size={16} color={theme.colors.primary} />
            <Text style={styles.stemCounterText}>{totalStems} hastes selecionadas</Text>
          </View>
          
          <View style={styles.imageHalo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=400&auto=format&fit=crop' }} 
              style={styles.bouquetImage} 
            />
          </View>

          <Text style={styles.bouquetTitle}>Arranjo Autoral</Text>
          
          <View style={styles.progressBarContainer}>
            {flowersData.map(flower => {
              const qty = quantities[flower.id] || 0;
              const width = totalStems > 0 ? (qty / totalStems) * 100 : 0;
              if (width === 0) return null;
              return <View key={flower.id} style={{ width: `${width}%`, height: '100%', backgroundColor: flower.color }} />;
            })}
          </View>
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>TOTAL ESTIMADO</Text>
          <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2).replace('.', ',')}</Text>
        </View>
        
        {step < 3 ? (
          <TouchableOpacity style={styles.advanceButton} onPress={() => setStep(step + 1)}>
            <Text style={styles.advanceButtonText}>Avançar</Text>
            <MaterialIcons name="arrow-forward" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <MaterialIcons name="shopping-bag" size={20} color={theme.colors.white} />
            <Text style={styles.advanceButtonText}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingBottom: 100 },
  
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 16, paddingHorizontal: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepActive: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepTextActive: { color: theme.colors.white, fontSize: 12, fontFamily: theme.fonts.bodyBold },
  stepLabelActive: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginLeft: 6 },
  stepLine: { flex: 1, height: 2, backgroundColor: theme.colors.border, marginHorizontal: 8 },
  stepLineActive: { backgroundColor: theme.colors.primary },
  stepInactive: { width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  stepTextInactive: { color: theme.colors.textOutline, fontSize: 12, fontFamily: theme.fonts.bodyBold },
  stepLabel: { fontFamily: theme.fonts.bodyMedium, fontSize: 12, color: theme.colors.textOutline, marginLeft: 6 },

  visualPanel: { backgroundColor: theme.colors.surface, marginHorizontal: theme.spacing.margin, borderRadius: theme.radius.lg, padding: 20, alignItems: 'center', marginBottom: 24 },
  stemCounter: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primaryFixed, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  stemCounterText: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.primary, marginLeft: 6 },
  imageHalo: { width: 120, height: 120, borderRadius: 60, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  bouquetImage: { width: 100, height: 100, borderRadius: 50 },
  bouquetTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary, marginBottom: 16 },
  progressBarContainer: { width: '100%', height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceContainer, flexDirection: 'row', overflow: 'hidden' },

  sectionContainer: { paddingHorizontal: theme.spacing.margin, marginBottom: 24 },
  sectionTitle: { fontFamily: theme.fonts.title, fontSize: 20, color: theme.colors.primary },
  sectionSubtitle: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginBottom: 12 },
  
  flowerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.radius.md, marginBottom: 10 },
  flowerImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  flowerInfo: { flex: 1 },
  flowerName: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  flowerPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary, marginTop: 2 },
  perStem: { fontFamily: theme.fonts.body, fontSize: 10, color: theme.colors.textOutline },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceContainer, borderRadius: 20, padding: 4 },
  counterButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  counterText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary, width: 24, textAlign: 'center' },

  /* ESTILOS DO GRID DE FOLHAGENS */
  foliageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  foliageCard: { 
    width: '48%', // Ocupa quase metade da tela
    backgroundColor: theme.colors.surface, 
    padding: 16, 
    borderRadius: theme.radius.md, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: 'transparent',
    marginBottom: 12
  },
  foliageCardActive: { 
    borderColor: theme.colors.primary, 
    backgroundColor: theme.colors.surfaceContainer 
  },
  foliageIcon: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: theme.colors.background, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  foliageName: { 
    fontFamily: theme.fonts.bodyBold, 
    fontSize: 13, 
    color: theme.colors.primary, 
    textAlign: 'center',
    marginBottom: 4
  },
  foliagePrice: { 
    fontFamily: theme.fonts.bodyBold, 
    fontSize: 12, 
    color: theme.colors.secondary 
  },

  packagingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 16, borderRadius: theme.radius.md, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  packagingCardActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.surfaceContainer },
  packagingName: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },
  packagingDesc: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  packagingPrice: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.primary },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, flexDirection: 'row', padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: theme.colors.border, alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.textSecondary, letterSpacing: 1 },
  totalPrice: { fontFamily: theme.fonts.title, fontSize: 24, color: theme.colors.primary },
  advanceButton: { flexDirection: 'row', backgroundColor: theme.colors.primary, height: 48, paddingHorizontal: 24, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  finishButton: { flexDirection: 'row', backgroundColor: theme.colors.secondary, height: 48, paddingHorizontal: 24, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  advanceButtonText: { fontFamily: theme.fonts.bodyBold, fontSize: 14, color: theme.colors.white, marginRight: 8, textTransform: 'uppercase' },
});