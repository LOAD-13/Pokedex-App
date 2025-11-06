import { useState, useMemo } from 'react';
import type { PokemonListItem } from '../../types/pokemon';
import { getPokemon } from '../../services/pokeapi';
import { getTypeColor } from '../../utils/colors';
import { analyzeTeamCoverage } from '../../utils/typeEffectiveness';

interface TeamBuilderProps {
  pokemonList: PokemonListItem[];
}

interface TeamPokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

export default function TeamBuilder({ pokemonList }: TeamBuilderProps) {
  const [team, setTeam] = useState<(TeamPokemon | null)[]>(Array(6).fill(null));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !team.some(t => t?.id === p.id)
  ).slice(0, 20);
  
  const handleSelectPokemon = async (pokemon: PokemonListItem, slotIndex: number) => {
    setIsLoading(true);
    try {
      const details = await getPokemon(pokemon.id);
      const newPokemon: TeamPokemon = {
        id: details.id,
        name: details.name,
        types: details.types.map((t: any) => t.type.name),
        sprite: details.sprites.other['official-artwork'].front_default,
      };
      
      const newTeam = [...team];
      newTeam[slotIndex] = newPokemon;
      setTeam(newTeam);
      setSelectedSlot(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };
  
  const resetTeam = () => {
    setTeam(Array(6).fill(null));
    setSelectedSlot(null);
    setSearchQuery('');
  };
  
  // Análisis del equipo
  const teamAnalysis = useMemo(() => {
    const activePokemon = team.filter(p => p !== null) as TeamPokemon[];
    if (activePokemon.length === 0) return null;
    
    return analyzeTeamCoverage(activePokemon.map(p => ({ types: p.types })));
  }, [team]);
  
  const teamCount = team.filter(p => p !== null).length;
  
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
            Team Builder
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Construye tu equipo de hasta 6 Pokémon y analiza sus fortalezas y debilidades.
          </p>
        </div>
        {teamCount > 0 && (
          <button
            onClick={resetTeam}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e4290c]/20 text-[#e4290c] hover:bg-[#e4290c]/30 transition-colors"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            <span className="font-bold text-sm">Resetear Equipo</span>
          </button>
        )}
      </div>
      
      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {team.map((pokemon, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/5 min-h-[240px] cursor-pointer hover:border-[#e4290c] transition-colors"
            onClick={() => !pokemon && setSelectedSlot(index)}
          >
            {pokemon ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePokemon(index);
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors z-10"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-24 h-24 object-contain"
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                    {pokemon.name}
                  </p>
                  <div className="flex gap-1 mt-2 justify-center flex-wrap">
                    {pokemon.types.map(type => (
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
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600">
                  add_circle
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Slot {index + 1}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Search Modal */}
      {selectedSlot !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Seleccionar Pokémon
              </h2>
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Pokémon..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#e4290c] focus:border-transparent mb-4"
              autoFocus
            />
            
            <div className="space-y-2">
              {filteredPokemon.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPokemon(p, selectedSlot)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img src={p.sprite} alt={p.name} className="w-12 h-12" />
                  <div className="text-left">
                    <p className="capitalize font-medium text-gray-900 dark:text-white">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      #{p.id.toString().padStart(3, '0')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Team Analysis */}
      {teamAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            📊 Análisis del Equipo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weaknesses */}
            <div>
              <h3 className="text-lg font-bold text-red-500 mb-3">
                ❌ Debilidades
              </h3>
              {Object.entries(teamAnalysis.weaknesses).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(teamAnalysis.weaknesses)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, multiplier]) => (
                      <div
                        key={type}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        <span className="uppercase">{type}</span>
                        <span className="opacity-80">
                          ×{multiplier.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¡Sin debilidades críticas!
                </p>
              )}
            </div>
            
            {/* Resistances */}
            <div>
              <h3 className="text-lg font-bold text-green-500 mb-3">
                ✅ Resistencias
              </h3>
              {Object.entries(teamAnalysis.resistances).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(teamAnalysis.resistances)
                    .sort(([, a], [, b]) => a - b)
                    .map(([type, multiplier]) => (
                      <div
                        key={type}
                        className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        <span className="uppercase">{type}</span>
                        <span className="opacity-80">
                          ×{multiplier.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sin resistencias especiales
                </p>
              )}
            </div>
            
            {/* Immunities */}
            <div>
              <h3 className="text-lg font-bold text-blue-500 mb-3">
                🛡️ Inmunidades
              </h3>
              {teamAnalysis.immunities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teamAnalysis.immunities.map(type => (
                    <div
                      key={type}
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      <span className="uppercase">{type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sin inmunidades de tipo
                </p>
              )}
            </div>
          </div>
          
          {/* Recommendations */}
          {teamCount < 6 && Object.entries(teamAnalysis.weaknesses).length > 0 && (
            <div className="mt-6 p-4 bg-[#e4290c]/10 dark:bg-[#e4290c]/20 rounded-lg border border-[#e4290c]/30">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                💡 Recomendaciones
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Tu equipo tiene debilidades a:{' '}
                {Object.entries(teamAnalysis.weaknesses)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([type]) => type)
                  .join(', ')}
                . Considera agregar Pokémon que resistan estos tipos.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
