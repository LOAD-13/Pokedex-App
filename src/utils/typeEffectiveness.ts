export const typeEffectiveness: Record<string, {
    weakTo: string[];
    resistantTo: string[];
    immuneTo: string[];
    strongAgainst: string[];
  }> = {
    normal: {
      weakTo: ['fighting'],
      resistantTo: [],
      immuneTo: ['ghost'],
      strongAgainst: [],
    },
    fire: {
      weakTo: ['water', 'ground', 'rock'],
      resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
      immuneTo: [],
      strongAgainst: ['grass', 'ice', 'bug', 'steel'],
    },
    water: {
      weakTo: ['electric', 'grass'],
      resistantTo: ['fire', 'water', 'ice', 'steel'],
      immuneTo: [],
      strongAgainst: ['fire', 'ground', 'rock'],
    },
    grass: {
      weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
      resistantTo: ['water', 'electric', 'grass', 'ground'],
      immuneTo: [],
      strongAgainst: ['water', 'ground', 'rock'],
    },
    electric: {
      weakTo: ['ground'],
      resistantTo: ['electric', 'flying', 'steel'],
      immuneTo: [],
      strongAgainst: ['water', 'flying'],
    },
    ice: {
      weakTo: ['fire', 'fighting', 'rock', 'steel'],
      resistantTo: ['ice'],
      immuneTo: [],
      strongAgainst: ['grass', 'ground', 'flying', 'dragon'],
    },
    fighting: {
      weakTo: ['flying', 'psychic', 'fairy'],
      resistantTo: ['bug', 'rock', 'dark'],
      immuneTo: [],
      strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    },
    poison: {
      weakTo: ['ground', 'psychic'],
      resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
      immuneTo: [],
      strongAgainst: ['grass', 'fairy'],
    },
    ground: {
      weakTo: ['water', 'grass', 'ice'],
      resistantTo: ['poison', 'rock'],
      immuneTo: ['electric'],
      strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
    },
    flying: {
      weakTo: ['electric', 'ice', 'rock'],
      resistantTo: ['grass', 'fighting', 'bug'],
      immuneTo: ['ground'],
      strongAgainst: ['grass', 'fighting', 'bug'],
    },
    psychic: {
      weakTo: ['bug', 'ghost', 'dark'],
      resistantTo: ['fighting', 'psychic'],
      immuneTo: [],
      strongAgainst: ['fighting', 'poison'],
    },
    bug: {
      weakTo: ['fire', 'flying', 'rock'],
      resistantTo: ['grass', 'fighting', 'ground'],
      immuneTo: [],
      strongAgainst: ['grass', 'psychic', 'dark'],
    },
    rock: {
      weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
      resistantTo: ['normal', 'fire', 'poison', 'flying'],
      immuneTo: [],
      strongAgainst: ['fire', 'ice', 'flying', 'bug'],
    },
    ghost: {
      weakTo: ['ghost', 'dark'],
      resistantTo: ['poison', 'bug'],
      immuneTo: ['normal', 'fighting'],
      strongAgainst: ['psychic', 'ghost'],
    },
    dragon: {
      weakTo: ['ice', 'dragon', 'fairy'],
      resistantTo: ['fire', 'water', 'electric', 'grass'],
      immuneTo: [],
      strongAgainst: ['dragon'],
    },
    dark: {
      weakTo: ['fighting', 'bug', 'fairy'],
      resistantTo: ['ghost', 'dark'],
      immuneTo: ['psychic'],
      strongAgainst: ['psychic', 'ghost'],
    },
    steel: {
      weakTo: ['fire', 'fighting', 'ground'],
      resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
      immuneTo: ['poison'],
      strongAgainst: ['ice', 'rock', 'fairy'],
    },
    fairy: {
      weakTo: ['poison', 'steel'],
      resistantTo: ['fighting', 'bug', 'dark'],
      immuneTo: ['dragon'],
      strongAgainst: ['fighting', 'dragon', 'dark'],
    },
  };
  
  export function calculateTypeMatchup(attackerType: string, defenderTypes: string[]): number {
    let multiplier = 1;
    
    defenderTypes.forEach(defType => {
      const effectiveness = typeEffectiveness[defType];
      if (effectiveness) {
        if (effectiveness.immuneTo.includes(attackerType)) {
          multiplier *= 0;
        } else if (effectiveness.weakTo.includes(attackerType)) {
          multiplier *= 2;
        } else if (effectiveness.resistantTo.includes(attackerType)) {
          multiplier *= 0.5;
        }
      }
    });
    
    return multiplier;
  }
  
  export function analyzeTeamCoverage(team: Array<{ types: string[] }>) {
    const weaknesses: Record<string, number> = {};
    const resistances: Record<string, number> = {};
    const immunities: Set<string> = new Set();
    
    const allTypes = Object.keys(typeEffectiveness);
    
    allTypes.forEach(attackType => {
      let teamMultiplier = 0;
      
      team.forEach(pokemon => {
        const multiplier = calculateTypeMatchup(attackType, pokemon.types);
        teamMultiplier += multiplier;
      });
      
      const avgMultiplier = teamMultiplier / team.length;
      
      if (avgMultiplier === 0) {
        immunities.add(attackType);
      } else if (avgMultiplier > 1) {
        weaknesses[attackType] = avgMultiplier;
      } else if (avgMultiplier < 1) {
        resistances[attackType] = avgMultiplier;
      }
    });
    
    return { weaknesses, resistances, immunities: Array.from(immunities) };
  }