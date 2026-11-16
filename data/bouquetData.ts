import { productsData } from './products';

// Filtra as flores unitárias do productsData e adapta para o formato do bouquet
export const flowersData = productsData
  .filter(p => p.category === 'Flores soltas')
  .map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    color: p.flowers[0]?.color || '#7DAA7A',
    image: p.image,
  }));

export const foliageData = [
  { 
    id: 'eucalipto', 
    name: 'Eucalipto Prata', 
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'oliveira', 
    name: 'Ramo de Oliveira', 
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'mosquitinho', 
    name: 'Mosquitinho Nuvem', 
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=200&auto=format&fit=crop'
  },
  { 
    id: 'ruscus', 
    name: 'Ruscus Italiano', 
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=200&auto=format&fit=crop'
  },
];

export const finishingOptions = [
  { id: 'corte_v', name: 'Corte em V', price: 0 },
  { id: 'sem_folhas', name: 'Sem folhas na base', price: 0 },
  { id: 'com_folhas', name: 'Com folhas na base', price: 0 },
];