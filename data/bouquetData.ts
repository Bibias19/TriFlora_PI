import { productsData } from './products';
import { localImages } from './localImages';

// Filtra as flores unitárias do productsData e adapta para o formato do bouquet
export const flowersData = productsData
  .filter(p => p.category === 'Flores soltas')
  .map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    // Garante que a cor seja extraída corretamente, com fallback para verde
    color: p.flowers && p.flowers.length > 0 ? p.flowers[0].color : '#7DAA7A',
    image: p.image,
  }));

export const foliageData = [
  { 
    id: 'eucalipto', 
    name: 'Eucalipto Prata', 
    price: 12.00,
    image: localImages.foliage.eucalyptus
  },
  { 
    id: 'oliveira', 
    name: 'Ramo de Oliveira', 
    price: 14.00,
    image: localImages.foliage.olive
  },
  { 
    id: 'mosquitinho', 
    name: 'Mosquitinho Nuvem', 
    price: 10.00,
    image: localImages.foliage.greenery
  },
  { 
    id: 'ruscus', 
    name: 'Ruscus Italiano', 
    price: 15.00,
    image: localImages.foliage.ruscus
  },
];

export const finishingOptions = [
  { id: 'corte_v', name: 'Corte em V', price: 0 },
  { id: 'sem_folhas', name: 'Sem folhas na base', price: 0 },
  { id: 'com_folhas', name: 'Com folhas na base', price: 0 },
];