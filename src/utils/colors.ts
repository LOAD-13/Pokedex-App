export const typeColors: Record<string, string> = {
    bug: '#a8b820',
    dark: '#705848',
    dragon: '#7038f8',
    electric: '#f8d030',
    fairy: '#ee99ac',
    fighting: '#c03028',
    fire: '#f08030',
    flying: '#a890f0',
    ghost: '#705898',
    grass: '#78c850',
    ground: '#e0c068',
    ice: '#98d8d8',
    normal: '#a8a878',
    poison: '#a040a0',
    psychic: '#f85888',
    rock: '#b8a038',
    steel: '#b8b8d0',
    water: '#6890f0',
  };
  
  export const typeGradients: Record<string, string> = {
    grass: 'from-green-400 to-green-600',
    fire: 'from-red-400 to-orange-600',
    water: 'from-blue-400 to-blue-600',
    electric: 'from-yellow-300 to-yellow-500',
    psychic: 'from-pink-400 to-pink-600',
    // ... añade más según necesites
  };
  
  export function getTypeColor(type: string): string {
    return typeColors[type.toLowerCase()] || '#a8a878';
  }
  
  export function getTypeGradient(type: string): string {
    return typeGradients[type.toLowerCase()] || 'from-gray-400 to-gray-600';
  }