export const productsData = [
  // --- FLORES DA ESTAÇÃO / FLORES SOLTAS ---
  {
    id: '1',
    name: 'Bouquet Harmonia Triflora',
    category: 'Assinatura Triflora',
    price: 219.90,
    rating: 4.9,
    reviews: 128,
    description: 'Uma sinfonia botânica que une o perfume etéreo dos lírios imperiais, o toque aveludado das peônias e o calor solar dos girassóis.',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'
    ],
    flowers: [
      { name: 'Lírio Imperial', color: '#D3DEC9', meaning: 'Representa pureza, novos recomeços e a paz suave.' },
      { name: 'Peônia Japonesa', color: '#E56A8C', meaning: 'Simboliza prosperidade abundante, afeto caloroso e elegância.' }
    ]
  },
  {
    id: '2',
    name: 'Peônia Imperial',
    category: 'Flores da Estação',
    price: 48.00,
    rating: 5.0,
    reviews: 42,
    description: 'A delicadeza das pétalas cor-de-rosa em sua forma mais pura. Colhidas à mão para garantir durabilidade.',
    image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Peônia', color: '#E56A8C', meaning: 'Romance, prosperidade e delicadeza.' }]
  },
  {
    id: '3',
    name: 'Tulipa Alba Fresca',
    category: 'Flores da Estação',
    price: 36.00,
    rating: 4.8,
    reviews: 67,
    description: 'Tulipas brancas que trazem elegância e serenidade para qualquer ambiente. Ideal para presentear.',
    image: 'https://images.unsplash.com/photo-1587577319445-8db6d7eb278a?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1587577319445-8db6d7eb278a?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Tulipa', color: '#F2B33D', meaning: 'Amor perfeito e fama.' }]
  },
  {
    id: '4',
    name: 'Lírio Casablanca',
    category: 'Flores da Estação',
    price: 54.00,
    rating: 4.9,
    reviews: 89,
    description: 'Lírios brancos puros e perfumados. O símbolo máximo de sofisticação e paz.',
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Lírio', color: '#D3DEC9', meaning: 'Pureza e majestade.' }]
  },
  
  // --- MAIS VENDIDOS / ARRANJOS ---
  {
    id: '5',
    name: 'Bouquet Afeto Três Flores',
    category: 'Mais Vendidos',
    price: 189.00,
    rating: 5.0,
    reviews: 210,
    description: 'Uma composição perfeita de girassol, lírio e peônia. O presente ideal para demonstrar carinho.',
    image: 'https://images.unsplash.com/photo-1591886812855-0a73fc23f5ce?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1591886812855-0a73fc23f5ce?q=80&w=800&auto=format&fit=crop'],
    flowers: [
      { name: 'Girassol', color: '#F2B33D', meaning: 'Alegria e vitalidade.' },
      { name: 'Lírio', color: '#D3DEC9', meaning: 'Paz e pureza.' }
    ]
  },
  {
    id: '6',
    name: 'Cesta Manhã Dourada',
    category: 'Para Presente',
    price: 245.00,
    rating: 4.7,
    reviews: 56,
    description: 'Uma cesta repleta de flores frescas e delícias artesanais para começar o dia com o pé direito.',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Girassol', color: '#F2B33D', meaning: 'Energia positiva.' }]
  },
  {
    id: '7',
    name: 'Arranjo Jardim Secreto',
    category: 'Arranjos',
    price: 320.00,
    rating: 5.0,
    reviews: 34,
    description: 'Flores campestres, folhagens nobres e um toque rústico para trazer a natureza para dentro de casa.',
    image: 'https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1595124350361-193a200f7308?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Flor do Campo', color: '#9B6DBA', meaning: 'Simplicidade e beleza natural.' }]
  },
  {
    id: '8',
    name: 'Bouquet Noite de Lavanda',
    category: 'Bouquets',
    price: 175.00,
    rating: 4.9,
    reviews: 112,
    description: 'O aroma relaxante da lavanda combinado com rosas brancas. Perfeito para ambientes de descanso.',
    image: 'https://images.unsplash.com/photo-1596438459194-f28de43b12ee?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1596438459194-f28de43b12ee?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Lavanda', color: '#9B6DBA', meaning: 'Calma, paz e aromaterapia.' }]
  },
  {
    id: '9',
    name: 'Rosas Vermelhas Eternas',
    category: 'Clássicos',
    price: 289.00,
    rating: 5.0,
    reviews: 340,
    description: 'O clássico atemporal. Rosas vermelhas selecionadas para declarar o mais puro amor.',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Rosa Vermelha', color: '#BA1A1A', meaning: 'Amor paixão e desejo.' }]
  },
  {
    id: '10',
    name: 'Kit Festa Primaveril',
    category: 'Kits',
    price: 450.00,
    rating: 4.8,
    reviews: 25,
    description: 'Tudo o que você precisa para decorar uma mesa de festa com flores frescas e mini arranjos.',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop'],
    flowers: [{ name: 'Mix de Flores', color: '#F07A3A', meaning: 'Celebração e alegria.' }]
  }
];