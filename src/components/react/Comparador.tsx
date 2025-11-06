import { useState, useMemo } from 'react';
import type { PokemonListItem } from '../../types/pokemon';
import { getPokemon } from '../../services/pokeapi';
import { getTypeColor } from '../../utils/colors';
import { calculateTypeMatchup } from '../../utils/typeEffectiveness';

interface ComparadorProps {
  pokemonList: PokemonListItem[];
}

interface SelectedPokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  spriteNormal: string; // Sprite normal del Pokémon
  stats: Array<{ name: string; value: number }>;
  abilities: string[];
  total: number;
}

export default function Comparador({ pokemonList }: ComparadorProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);
  
  const handleSelectPokemon = async (pokemon: PokemonListItem) => {
    if (selectedPokemon.length >= 3) return;
    if (selectedPokemon.some(p => p.id === pokemon.id)) return;
    
    setIsLoading(true);
    try {
      const details = await getPokemon(pokemon.id);

      // Asegurarnos de que el sprite normal exista con fallback
      const spriteNormal = details.sprites.front_default || 
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`;  

      const newPokemon: SelectedPokemon = {
        id: details.id,
        name: details.name,
        types: details.types.map((t: any) => t.type.name),
        sprite: details.sprites.other['official-artwork'].front_default,
        spriteNormal: spriteNormal, // Sprite pixelado para el ganador
        stats: details.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        abilities: details.abilities.map((a: any) => a.ability.name),
        total: details.stats.reduce((sum: number, s: any) => sum + s.base_stat, 0),
      };
      setSelectedPokemon([...selectedPokemon, newPokemon]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removePokemon = (id: number) => {
    setSelectedPokemon(selectedPokemon.filter(p => p.id !== id));
  };
  
  const resetComparison = () => {
    setSelectedPokemon([]);
    setSearchQuery('');
  };
  
  // Análisis de comparación mejorado
  const comparisonResult = useMemo(() => {
    if (selectedPokemon.length < 2) return null;
    
    const winner = selectedPokemon.reduce((prev, current) => 
      current.total > prev.total ? current : prev
    );
    
    // Análisis detallado de ventajas de tipo
    const detailedTypeMatchups = selectedPokemon.map((attacker, i) => {
      return selectedPokemon.map((defender, j) => {
        if (i === j) return null;
        
        // Calculamos la efectividad de cada tipo del atacante contra cada tipo del defensor
        const typeDetails = attacker.types.map(attackType => {
          const effectiveness = calculateTypeMatchup(attackType, defender.types);
          return {
            attackType,
            effectiveness,
            defenderTypes: defender.types,
          };
        });
        
        // Obtenemos la máxima efectividad
        const maxEffectiveness = Math.max(...typeDetails.map(t => t.effectiveness));
        const bestType = typeDetails.find(t => t.effectiveness === maxEffectiveness);
        
        return {
          attacker: attacker.name,
          defender: defender.name,
          bestType: bestType?.attackType,
          defenderTypes: defender.types,
          effectiveness: maxEffectiveness,
        };
      });
    });
    
    return { winner, detailedTypeMatchups };
  }, [selectedPokemon]);
  
  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
  const statLabels: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    'speed': 'Velocidad',
  };
  
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
            Comparador de Pokémon
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Selecciona de 2 a 3 Pokémon para comparar sus estadísticas y ventajas de tipo.
          </p>
        </div>
        {selectedPokemon.length > 0 && (
          <button
            onClick={resetComparison}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e4290c]/20 text-[#e4290c] hover:bg-[#e4290c]/30 transition-colors"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            <span className="font-bold text-sm">Resetear</span>
          </button>
        )}
      </div>
      
      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, index) => {
          const pokemon = selectedPokemon[index];
          
          if (!pokemon) {
            return (
              <div key={index} className="relative flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/5 min-h-[480px]">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                  add_circle
                </span>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Seleccionar Pokémon
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Slot {index + 1}
                  </p>
                </div>
                
                {/* Search */}
                {index === selectedPokemon.length && (
                  <div className="w-full mt-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar Pokémon..."
                      className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#e4290c] focus:border-transparent"
                    />
                    {searchQuery && (
                      <div className="mt-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        {filteredPokemon.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleSelectPokemon(p)}
                            className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <img src={p.sprite} alt={p.name} className="w-10 h-10" />
                            <span className="capitalize font-medium text-gray-900 dark:text-white">
                              {p.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }
          
          return (
            <div key={pokemon.id} className="relative flex flex-col gap-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <button
                onClick={() => removePokemon(pokemon.id)}
                className="absolute top-4 right-4 p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              
              <div className="flex flex-col items-center gap-4">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain"
                />
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {pokemon.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {pokemon.types.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Estadísticas Base
                </h3>
                {pokemon.stats.map(stat => {
                  const maxValue = Math.max(...selectedPokemon.flatMap(p => p.stats).map(s => s.value));
                  const isHighest = stat.value === maxValue && selectedPokemon.length > 1;
                  
                  return (
                    <div key={stat.name} className="flex items-center gap-2 text-sm">
                      <span className="w-24 text-gray-600 dark:text-gray-400 font-medium">
                        {statLabels[stat.name]}
                      </span>
                      <span className={`w-8 font-bold ${isHighest ? 'text-[#e4290c]' : 'text-gray-900 dark:text-white'}`}>
                        {stat.value}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${isHighest ? 'bg-[#e4290c]' : 'bg-blue-500'}`}
                          style={{ width: `${(stat.value / 255) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-[#e4290c]">{pokemon.total}</span>
                  </div>
                </div>
              </div>
              
              {/* Abilities */}
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Habilidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(ability => (
                    <span
                      key={ability}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-900 dark:text-white capitalize"
                    >
                      {ability.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Comparison Result - FONDO ROJO */}
      {comparisonResult && selectedPokemon.length >= 2 && (
        <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 dark:from-red-600/30 dark:to-red-500/30 rounded-lg p-6 border border-red-500/40">
          <div className="flex items-center gap-3 mb-6">
            {/* Icono de Resultado de Comparación */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
              <path d="M9 15v2" />
              <path d="M12 11v6" />
              <path d="M15 13v4" />
            </svg>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Resultado de la Comparación
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ganador por Estadísticas - CON SPRITE NORMAL */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                {/* Icono de Pokeball */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e4290c]">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M3 12h6" />
                  <path d="M15 12h6" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ganador por Estadísticas
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={comparisonResult.winner.spriteNormal}
                  alt={comparisonResult.winner.name}
                  className="w-24 h-24 pixelated"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div>
                  <p className="text-xl font-bold text-[#e4290c] capitalize">
                    {comparisonResult.winner.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {comparisonResult.winner.total}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {comparisonResult.winner.types.map(type => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-full text-xs font-bold text-white uppercase"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ventajas de Tipo - INFORMACIÓN DETALLADA */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                {/* Icono de Backpack */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e4290c]">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 18v-6a6 6 0 0 1 6 -6h2a6 6 0 0 1 6 6v6a3 3 0 0 1 -3 3h-8a3 3 0 0 1 -3 -3z" />
                  <path d="M10 6v-1a2 2 0 1 1 4 0v1" />
                  <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                  <path d="M11 10h2" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ventajas de Tipo
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                {comparisonResult.detailedTypeMatchups.map((matchups, i) => (
                  <div key={i} className="space-y-2">
                    {matchups.map((matchup, j) => {
                      if (!matchup) return null;
                      
                      return (
                        <div key={j} className="flex flex-col gap-1 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold capitalize text-gray-900 dark:text-white">
                              {matchup.attacker}
                            </span>
                            {matchup.bestType && (
                              <span
                                className="px-2 py-0.5 rounded text-xs font-bold text-white uppercase"
                                style={{ backgroundColor: getTypeColor(matchup.bestType) }}
                              >
                                {matchup.bestType}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 dark:text-gray-400">vs</span>
                            <span className="capitalize">{matchup.defender}</span>
                            <div className="flex gap-1">
                              {matchup.defenderTypes.map(type => (
                                <span
                                  key={type}
                                  className="px-1.5 py-0.5 rounded text-xs font-bold text-white uppercase"
                                  style={{ backgroundColor: getTypeColor(type) }}
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className={
                              matchup.effectiveness > 1 
                                ? 'text-green-600 dark:text-green-400 font-bold' 
                                : matchup.effectiveness < 1 
                                ? 'text-red-600 dark:text-red-400 font-bold' 
                                : 'text-gray-600 dark:text-gray-400'
                            }>
                              {matchup.effectiveness > 1 
                                ? `✓ Súper efectivo (${matchup.effectiveness}×)` 
                                : matchup.effectiveness < 1 
                                ? `✗ No muy efectivo (${matchup.effectiveness}×)` 
                                : matchup.effectiveness === 0
                                ? '○ No tiene efecto'
                                : '− Normal (1×)'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
