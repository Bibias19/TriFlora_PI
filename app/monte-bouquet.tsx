import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';
import { Header } from '../components/Header';
import { useCart } from '../context/CartContext';
import { flowersData, foliageData, finishingOptions } from '../data/bouquetData';
import { localImages } from '../data/localImages';

export default function MonteBouquet() {
  const { addItem } = useCart();
  const [step, setStep] = useState(1);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedFoliage, setSelectedFoliage] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState('kraft');
  const [selectedFinishing, setSelectedFinishing] = useState<string>('corte_v');
  
  const [showRecommendationWarning, setShowRecommendationWarning] = useState(false);
  const [showMaxWarning, setShowMaxWarning] = useState(false);
  const [showMinWarning, setShowMinWarning] = useState(false);

  useEffect(() => {
    const total = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
    
    if (total === 12) {
      setShowRecommendationWarning(true);
    } else if (total > 12) {
      setShowRecommendationWarning(false);
    }
    
    if (total === 20) {
      setShowMaxWarning(true);
    } else if (total < 20) {
      setShowMaxWarning(false);
    }

    if (total < 2) {
      setShowMinWarning(true);
    } else {
      setShowMinWarning(false);
    }
  }, [quantities]);

  const updateQuantity = (id: string, delta: number) => {
    const currentTotal = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
    if (delta > 0 && currentTotal >= 20) {
      return; 
    }
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const toggleFoliage = (id: string) => {
    setSelectedFoliage(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    const totalStems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
    
    if (step === 1 && totalStems < 2) {
      Alert.alert(
        "Atenção",
        "Selecione pelo menos 2 hastes para montar um arranjo. Se for apenas 1 flor, isso é uma flor unitária.",
        [{ text: "Entendi" }]
      );
      return;
    }
    setStep(step + 1);
  };

  const totalStems = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const progressPercent = Math.min(100, Math.round((totalStems / 12) * 100));

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
      image: localImages.bouquetPreview, // Aqui mantemos para o carrinho
      type: 'custom_bouquet'
    });
    router.push('/(tabs)/carrinho');
  };

  const renderStep1 = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Flores Principais</Text>
      <Text style={styles.sectionSubtitle}>Selecione as flores do seu arranjo (mín. 2, máx. 20 hastes)</Text>
      
      {flowersData.map(flower => {
        const qty = quantities[flower.id] || 0;
        const isMaxReached = totalStems >= 20;

        return (
          <View key={flower.id} style={styles.flowerCard}>
            <Image source={flower.image} style={styles.flowerImage} />
            <View style={styles.flowerInfo}>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View 
                  style={{ 
                    width: 16, 
                    height: 16, 
                    borderRadius: 8, 
                    backgroundColor: flower.color,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                    marginRight: 8,
                    minWidth: 16, 
                    minHeight: 16 
                  }} 
                />
                <Text style={styles.flowerName} numberOfLines={2}>{flower.name}</Text>
              </View>
              <Text style={styles.flowerPrice}>R$ {flower.price.toFixed(2).replace('.', ',')} <Text style={styles.perStem}>/ haste</Text></Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton} 
                onPress={() => updateQuantity(flower.id, -1)}
              >
                <MaterialIcons name="remove" size={18} color={theme.colors.white} />
              </TouchableOpacity>
              <Text style={styles.counterText}>{qty}</Text>
              <TouchableOpacity 
                style={[styles.counterButton, isMaxReached && styles.counterButtonDisabled]} 
                onPress={() => updateQuantity(flower.id, 1)}
                disabled={isMaxReached}
              >
                <MaterialIcons name="add" size={18} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={styles.finishingWrapper}>
        <View style={styles.finishingHeader}>
          <MaterialIcons name="content-cut" size={20} color={theme.colors.primary} />
          <Text style={styles.finishingTitle}>Acabamento da Haste</Text>
        </View>
        <Text style={styles.finishingSubtitle}>Escolha como preparar as flores</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.finishingScroll}>
          {finishingOptions.map(opt => {
            const isSelected = selectedFinishing === opt.id;
            return (
              <TouchableOpacity 
                key={opt.id} 
                style={[styles.finishingChip, isSelected && styles.finishingChipActive]}
                onPress={() => setSelectedFinishing(opt.id)}
              >
                {isSelected && <MaterialIcons name="check" size={14} color={theme.colors.white} />}
                <Text style={[styles.finishingChipText, isSelected && styles.finishingChipTextActive]}>
                  {opt.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Folhagens</Text>
      <Text style={styles.sectionSubtitle}>Adicione textura e frescor natural ao buquê</Text>
      
      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.infoText}>A adição de folhagens é opcional. Caso deseje um arranjo sem folhagens, prossiga clicando em "Avançar".</Text>
      </View>

      <View style={styles.foliageGrid}>
        {foliageData.map(foliage => {
          const isSelected = selectedFoliage.includes(foliage.id);
          return (
            <TouchableOpacity 
              key={foliage.id} 
              style={[styles.foliageCard, isSelected && styles.foliageCardActive]}
              onPress={() => toggleFoliage(foliage.id)}
            >
              <Image source={foliage.image} style={styles.foliageImage} />
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
            <Text style={styles.stemCounterText}>{totalStems} / 20 hastes máximas</Text>
          </View>
          
          <View style={styles.imageHalo}>
            <Image 
              // ✨ CORREÇÃO: Trocamos o bouquetPreview por uma imagem que com certeza existe (products.b1)
              source={localImages.products.b1} 
              style={styles.bouquetImage} 
            />
          </View>

          <Text style={styles.bouquetTitle}>Arranjo Autoral</Text>
          
          {/* ✨ CORREÇÃO: A barra de progresso agora tem fundo para ser visível */}
          <View style={styles.progressBarContainer}>
            {flowersData.map(flower => {
              const qty = quantities[flower.id] || 0;
              const width = totalStems > 0 ? (qty / totalStems) * 100 : 0;
              if (width === 0) return null;
              return <View key={flower.id} style={{ width: `${width}%`, height: '100%', backgroundColor: flower.color }} />;
            })}
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>Volume do buquê</Text>
            <Text style={styles.progressLabelText}>{progressPercent}%</Text>
          </View>

          {showMinWarning && (
            <View style={[styles.warningBox, { backgroundColor: 'rgba(186, 26, 26, 0.1)', borderColor: theme.colors.error }]}>
              <MaterialIcons name="error-outline" size={16} color={theme.colors.error} />
              <Text style={[styles.warningText, { color: theme.colors.error }]}>Selecione no mínimo 2 hastes para avançar.</Text>
            </View>
          )}

          {showRecommendationWarning && (
            <View style={styles.warningBox}>
              <MaterialIcons name="info-outline" size={16} color={theme.colors.terracotta} />
              <Text style={styles.warningText}>Você atingiu o número recomendado de 12 hastes. Deseja continuar adicionando?</Text>
            </View>
          )}

          {showMaxWarning && (
            <View style={[styles.warningBox, { backgroundColor: 'rgba(186, 26, 26, 0.15)' }]}>
              <MaterialIcons name="error-outline" size={16} color={theme.colors.error} />
              <Text style={[styles.warningText, { color: theme.colors.error, fontFamily: theme.fonts.bodyBold }]}>Máximo de 20 hastes atingido.</Text>
            </View>
          )}
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
          <TouchableOpacity style={styles.advanceButton} onPress={handleNextStep}>
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
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextActive: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.bodyBold,
  },
  stepLabelActive: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 6,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: theme.colors.primary,
  },
  stepInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTextInactive: {
    color: theme.colors.textOutline,
    fontSize: 12,
    fontFamily: theme.fonts.bodyBold,
  },
  stepLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
    color: theme.colors.textOutline,
    marginLeft: 6,
  },

  visualPanel: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.margin,
    borderRadius: theme.radius.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  stemCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  stemCounterText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 6,
  },
  imageHalo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden', // Garante que a imagem não vaze do círculo
  },
  bouquetImage: {
    width: '100%',
    height: '100%',
  },
  bouquetTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceContainer,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressLabels: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  progressLabelText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240, 122, 58, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.terracotta,
  },
  warningText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.terracotta,
    marginLeft: 6,
    flex: 1,
  },

  sectionContainer: {
    paddingHorizontal: theme.spacing.margin,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 20,
    color: theme.colors.primary,
  },
  sectionSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  
  flowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: theme.radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  flowerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  flowerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  flowerName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
    flex: 1,
  },
  flowerPrice: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  perStem: {
    fontFamily: theme.fonts.body,
    fontSize: 10,
    color: theme.colors.textOutline,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 20,
    padding: 4,
    marginLeft: 8,
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonDisabled: {
    backgroundColor: theme.colors.textOutline,
    opacity: 0.5,
  },
  counterText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
    width: 24,
    textAlign: 'center',
  },

  finishingWrapper: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 16,
    marginTop: 24,
  },
  finishingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  finishingTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 18,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  finishingSubtitle: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  finishingScroll: {
    marginLeft: -4,
  },
  finishingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  finishingChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  finishingChipText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  finishingChipTextActive: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bodyBold,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(62, 90, 62, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(62, 90, 62, 0.3)',
  },
  infoText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 8,
    flex: 1,
  },

  foliageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  foliageCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  foliageCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceContainer,
  },
  foliageImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  foliageName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  foliagePrice: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    color: theme.colors.secondary,
  },

  packagingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.md,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packagingCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceContainer,
  },
  packagingName: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  packagingDesc: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  packagingPrice: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 10,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  totalPrice: {
    fontFamily: theme.fonts.title,
    fontSize: 24,
    color: theme.colors.primary,
  },
  advanceButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advanceButtonText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.white,
    marginRight: 8,
    textTransform: 'uppercase',
  },
});