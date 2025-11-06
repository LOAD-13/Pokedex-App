import { useState, useMemo } from 'react';
import type { PokemonListItem } from '../../types/pokemon';
import { getPokemon } from '../../services/pokeapi';
import { getTypeColor } from '../../utils/colors';
import { analyzeTeamCoverage, typeEffectiveness } from '../../utils/typeEffectiveness';

interface TeamBuilderProps {
  pokemonList: PokemonListItem[];
}

interface TeamMember {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

export default function TeamBuilder({ pokemonList }: TeamBuilderProps) {
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredPokemon = useMemo(() => {
    return pokemonList
      .filter(p => !team.some(t => t?.id === p.id))
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20);
  }, [pokemonList, team, searchQuery]);
  
  const handleSelectPokemon = async (pokemon: PokemonListItem, slotIndex: number) => {
    setIsLoading(true);
    try {
      const details = await getPokemon(pokemon.id);
      const newMember: TeamMember = {
        id: details.id,
        name: details.name,
        types: details.types.map((t: any) => t.type.name),
        sprite: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
      };
      
      const newTeam = [...team];
      newTeam[slotIndex] = newMember;
      setTeam(newTeam);
      setActiveSlot(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removePokemon = (slotIndex: number) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };
  
  const clearTeam = () => {
    setTeam(Array(6).fill(null));
    setActiveSlot(null);
    setSearchQuery('');
  };
  
  const saveTeam = () => {
    const teamData = team.filter(t => t !== null);
    localStorage.setItem('pokemon-team', JSON.stringify(teamData));
    alert('¡Equipo guardado exitosamente!');
  };
  
  const loadTeam = () => {
    try {
      const savedTeam = localStorage.getItem('pokemon-team');
      if (savedTeam) {
        const parsed = JSON.parse(savedTeam);
        const newTeam = [...Array(6).fill(null)];
        parsed.forEach((member: TeamMember, index: number) => {
          if (index < 6) newTeam[index] = member;
        });
        setTeam(newTeam);
        alert('¡Equipo cargado exitosamente!');
      } else {
        alert('No hay equipo guardado');
      }
    } catch (error) {
      alert('Error al cargar el equipo');
    }
  };
  
  // Análisis del equipo
  const teamAnalysis = useMemo(() => {
    const activeTeam = team.filter((t): t is TeamMember => t !== null);
    if (activeTeam.length === 0) return null;
    
    return analyzeTeamCoverage(activeTeam);
  }, [team]);
  
  // Recomendaciones
  const recommendations = useMemo(() => {
    const activeTeam = team.filter((t): t is TeamMember => t !== null);
    if (activeTeam.length === 0 || !teamAnalysis) return [];
    
    const criticalWeaknesses = Object.entries(teamAnalysis.weaknesses)
      .filter(([_, mult]) => mult >= 2)
      .map(([type]) => type);
    
    if (criticalWeaknesses.length === 0) return [];
    
    // Encontrar Pokémon que resistan las debilidades críticas
    const recommendedPokemon = pokemonList
      .filter(p => !activeTeam.some(t => t.id === p.id))
      .map(p => {
        let score = 0;
        criticalWeaknesses.forEach(weakness => {
          p.types.forEach(type => {
            const typeData = typeEffectiveness[type];
            if (typeData?.resistantTo.includes(weakness)) score += 2;
            if (typeData?.immuneTo.includes(weakness)) score += 3;
          });
        });
        return { pokemon: p, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    return recommendedPokemon;
  }, [team, teamAnalysis, pokemonList]);
  
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
        <div className="flex gap-3">
          <button
            onClick={saveTeam}
            disabled={team.every(t => t === null)}
            className="px-4 py-2 rounded-full bg-[#e4290c] text-white font-bold text-sm hover:bg-[#c02209] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar Equipo
          </button>
          <button
            onClick={loadTeam}
            className="px-4 py-2 rounded-full bg-gray-700 text-white font-bold text-sm hover:bg-gray-600 transition-colors"
          >
            Cargar Equipo
          </button>
          <button
            onClick={clearTeam}
            disabled={team.every(t => t === null)}
            className="px-4 py-2 rounded-full bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar Todo
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Grid */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
            {team.map((member, index) => (
              <div key={index}>
                {member ? (
                  <div className="relative group flex flex-col gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 transition-shadow hover:shadow-lg">
                    <img
                      src={member.sprite}
                      alt={member.name}
                      className="w-full aspect-square object-contain rounded-lg"
                    />
                    <div>
                      <p className="text-base font-medium text-gray-900 dark:text-white capitalize truncate">
                        {member.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {member.types.map(type => (
                          <img
                            key={type}
                            src={`/icons/types/${type}.svg`}
                            alt={type}
                            className="w-4 h-4"
                            title={type}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removePokemon(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveSlot(index)}
                    className="flex flex-col gap-3 items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors min-h-[180px]"
                  >
                    <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-600">
                      add_circle
                    </span>
                    <div className="text-center">
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        + Agregar
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Slot {index + 1}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Search Pokemon */}
          {activeSlot !== null && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Seleccionar Pokémon para Slot {activeSlot + 1}
              </h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar Pokémon..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#e4290c] focus:border-transparent mb-3"
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredPokemon.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPokemon(p, activeSlot)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <img src={p.sprite} alt={p.name} className="w-12 h-12" />
                    <div className="flex-1 text-left">
                      <p className="capitalize font-medium text-gray-900 dark:text-white">
                        {p.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {p.types.map(type => (
                          <span
                            key={type}
                            className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: getTypeColor(type) }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActiveSlot(null)}
                className="w-full mt-3 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
        
        {/* Team Analysis */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Análisis del Equipo
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Cobertura defensiva general de tu equipo
              </p>
            </div>
            
            {teamAnalysis ? (
              <>
                {/* Resistencias */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    💪 Resistencias
                  </h3>
                  {Object.keys(teamAnalysis.resistances).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(teamAnalysis.resistances).map(([type, mult]) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-full"
                        >
                          <img
                            src={`/icons/types/${type}.svg`}
                            alt={type}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300 capitalize">
                            {type}
                          </span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            x{mult.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Tu equipo no tiene resistencias significativas.
                    </p>
                  )}
                </div>
                
                {/* Debilidades */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ⚠️ Debilidades
                  </h3>
                  {Object.keys(teamAnalysis.weaknesses).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(teamAnalysis.weaknesses).map(([type, mult]) => (
                        <div
                          key={type}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full ${
                            mult >= 2 ? 'bg-red-500/30' : 'bg-orange-500/20'
                          }`}
                        >
                          <img
                            src={`/icons/types/${type}.svg`}
                            alt={type}
                            className="w-5 h-5"
                          />
                          <span className={`text-sm font-medium capitalize ${
                            mult >= 2 ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'
                          }`}>
                            {type}
                          </span>
                          <span className={`text-xs font-bold ${
                            mult >= 2 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            x{mult.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      ¡Excelente! Tu equipo no tiene debilidades significativas.
                    </p>
                  )}
                </div>
                
                {/* Inmunidades */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    🛡️ Inmunidades
                  </h3>
                  {teamAnalysis.immunities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {teamAnalysis.immunities.map(type => (
                        <div
                          key={type}
                          className="flex items-center gap-2 bg-blue-500/20 px-3 py-2 rounded-full"
                        >
                          <img
                            src={`/icons/types/${type}.svg`}
                            alt={type}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300 capitalize">
                            {type}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Tu equipo no tiene inmunidades de tipo.
                    </p>
                  )}
                </div>
                
                {/* Recomendaciones */}
                {recommendations.length > 0 && team.some(t => t === null) && (
                  <div className="bg-[#e4290c]/10 dark:bg-[#e4290c]/20 rounded-lg p-4 border border-[#e4290c]/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined">lightbulb</span>
                      Recomendaciones
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      Estos Pokémon ayudarían a cubrir las debilidades críticas de tu equipo:
                    </p>
                    <div className="space-y-2">
                      {recommendations.map(({ pokemon, score }) => (
                        <button
                          key={pokemon.id}
                          onClick={() => {
                            const emptySlot = team.findIndex(t => t === null);
                            if (emptySlot !== -1) {
                              handleSelectPokemon(pokemon, emptySlot);
                            }
                          }}
                          className="w-full flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <img src={pokemon.sprite} alt={pokemon.name} className="w-12 h-12" />
                          <div className="flex-1 text-left">
                            <p className="capitalize font-medium text-gray-900 dark:text-white">
                              {pokemon.name}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {pokemon.types.map(type => (
                                <img
                                  key={type}
                                  src={`/icons/types/${type}.svg`}
                                  alt={type}
                                  className="w-4 h-4"
                                  title={type}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[#e4290c]">
                            <span className="material-symbols-outlined">star</span>
                            <span className="font-bold">{score}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  groups
                </span>
                <p className="text-gray-600 dark:text-gray-400">
                  Agrega Pokémon a tu equipo para ver el análisis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e4290c] border-t-transparent"></div>
              <span className="font-medium text-gray-900 dark:text-white">Cargando Pokémon...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}