import type { Pokemon, PokemonSpecies, EvolutionChain, PokemonListItem } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchAPI(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getPokemonList(limit: number = 151): Promise<PokemonListItem[]> {
  const url = `${BASE_URL}/pokemon?limit=${limit}`;
  const data = await fetchAPI(url);
  
  // Obtener detalles de cada Pokémon en paralelo (en lotes para no saturar)
  const batchSize = 20;
  const allPokemon: PokemonListItem[] = [];
  
  for (let i = 0; i < data.results.length; i += batchSize) {
    const batch = data.results.slice(i, i + batchSize);
    const pokemonPromises = batch.map(async (p: any, index: number) => {
      const id = i + index + 1;
      try {
        const details = await getPokemon(id);
        return {
          id,
          name: details.name,
          types: details.types.map((t: any) => t.type.name),
          sprite: details.sprites.other['official-artwork'].front_default || 
                  details.sprites.front_default || 
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      } catch (error) {
        console.error(`Error fetching Pokemon ${id}:`, error);
        return null;
      }
    });
    
    const batchResults = await Promise.all(pokemonPromises);
    allPokemon.push(...batchResults.filter(p => p !== null) as PokemonListItem[]);
  }
  
  return allPokemon;
}

export async function getPokemon(id: number | string): Promise<Pokemon> {
  const url = `${BASE_URL}/pokemon/${id}`;
  return fetchAPI(url);
}

export async function getPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const url = `${BASE_URL}/pokemon-species/${id}`;
  return fetchAPI(url);
}

export async function getEvolutionChain(url: string): Promise<EvolutionChain> {
  return fetchAPI(url);
}

export async function getPokemonDescription(id: number): Promise<string> {
  try {
    const species = await getPokemonSpecies(id);
    const entry = species.flavor_text_entries.find(
      (e) => e.language.name === 'en'
    );
    return entry ? entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'No description available.';
  } catch (error) {
    console.error('Error fetching description:', error);
    return 'No description available.';
  }
}

export async function getPokemonMoves(id: number | string): Promise<any[]> {
  try {
    const pokemon = await getPokemon(id);
    // Filtrar solo movimientos aprendidos por nivel
    const levelUpMoves = pokemon.moves
      .filter((move: any) => 
        move.version_group_details.some((detail: any) => 
          detail.move_learn_method.name === 'level-up'
        )
      )
      .map((move: any) => {
        const levelDetail = move.version_group_details.find((detail: any) => 
          detail.move_learn_method.name === 'level-up'
        );
        return {
          name: move.move.name,
          level: levelDetail?.level_learned_at || 0,
          url: move.move.url,
        };
      })
      .sort((a: any, b: any) => a.level - b.level)
      .slice(0, 20); // Primeros 20 movimientos
    
    return levelUpMoves;
  } catch (error) {
    console.error('Error fetching moves:', error);
    return [];
  }
}