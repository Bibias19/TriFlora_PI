import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Header } from '../components/Header';

const especialistasData = [
  {
    id: '1',
    name: 'Marina Flores',
    specialty: 'Florista Sênior & Bouquets',
    experience: '10 anos de experiência',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    description: 'Especialista em arranjos românticos e bouquets autorais.',
    phone: '5511999999999',
  },
  {
    id: '2',
    name: 'Lucas Jardim',
    specialty: 'Paisagismo & Plantas',
    experience: '8 anos de experiência',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    description: 'Cuida de plantas e cria composições para ambientes.',
    phone: '5511999999999',
  },
  {
    id: '3',
    name: 'Camila Rosas',
    specialty: 'Decoração & Eventos',
    experience: '6 anos de experiência',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
    description: 'Especialista em decoração floral para festas e eventos.',
    phone: '5511999999999',
  },
];

export default function Especialistas() {
  const handleWhatsApp = (phone: string, name: string) => {
    const message = `Olá, ${name}! Vim pelo app Triflora e gostaria de falar com você.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.mainContainer}>
      <Header showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.titleContainer}>
          <View style={styles.titleTagContainer}>
            <View style={[styles.dot, { backgroundColor: theme.colors.leafGreen }]} />
            <Text style={[styles.titleTag, { color: theme.colors.leafGreen }]}>ATENDIMENTO ESPECIALIZADO</Text>
          </View>
          <Text style={styles.title}>Nossos Especialistas</Text>
          <Text style={styles.subtitle}>Converse com quem entende de flores e crie o arranjo perfeito.</Text>
        </View>

        <View style={styles.listContainer}>
          {especialistasData.map((esp) => (
            <TouchableOpacity 
              key={esp.id} 
              style={styles.card} 
              onPress={() => handleWhatsApp(esp.phone, esp.name)}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: esp.image }} style={styles.image} />
              </View>
              
              <View style={styles.info}>
                <Text style={styles.category}>{esp.specialty.toUpperCase()}</Text>
                <Text style={styles.name}>{esp.name}</Text>
                <Text style={styles.experience}>{esp.experience}</Text>
                <Text style={styles.description} numberOfLines={2}>{esp.description}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.whatsappButton}
                    onPress={() => handleWhatsApp(esp.phone, esp.name)}
                  >
                    <MaterialIcons name="chat" size={18} color={theme.colors.primary} />
                    <Text style={styles.whatsappText}>Conversar</Text>
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
  scrollContent: { paddingBottom: 40, paddingTop: 16 },

  titleContainer: { paddingHorizontal: theme.spacing.margin, marginBottom: 24 },
  titleTagContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  titleTag: { fontFamily: theme.fonts.bodyBold, fontSize: 11, letterSpacing: 1.5 },
  title: { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.primary },
  subtitle: { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.textPrimary, marginTop: 4 },

  listContainer: { paddingHorizontal: theme.spacing.margin },
  card: { 
    flexDirection: 'row', 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.radius.md, 
    marginBottom: 16, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageContainer: { width: 120, height: 170, position: 'relative' },
  image: { width: '100%', height: '100%' },
  
  info: { flex: 1, padding: 14, justifyContent: 'space-between' },
  category: { fontFamily: theme.fonts.bodyBold, fontSize: 10, color: theme.colors.leafGreen, letterSpacing: 1, marginBottom: 4 },
  name: { fontFamily: theme.fonts.title, fontSize: 18, color: theme.colors.primary, marginBottom: 4 },
  experience: { fontFamily: theme.fonts.bodyBold, fontSize: 12, color: theme.colors.textPrimary, marginBottom: 8 },
  description: { fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.textPrimary, lineHeight: 18, marginBottom: 8 },
  
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  whatsappButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 170, 122, 0.15)',
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20,
    gap: 6,
  },
  whatsappText: { fontFamily: theme.fonts.bodyBold, fontSize: 13, color: theme.colors.primary },
});