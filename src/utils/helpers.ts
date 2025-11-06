export function formatPokemonId(id: number): string {
    return `#${id.toString().padStart(3, '0')}`;
  }
  
  export function formatHeight(height: number): string {
    return `${(height / 10).toFixed(1)} m`;
  }
  
  export function formatWeight(weight: number): string {
    return `${(weight / 10).toFixed(1)} kg`;
  }
  
  export function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  export function formatStatName(stat: string): string {
    const statNames: Record<string, string> = {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      speed: 'Speed',
    };
    return statNames[stat] || stat;
  }