import { useState, useMemo } from 'react';
import { typeEffectiveness } from '../../utils/typeEffectiveness';

type Tab = 'types' | 'abilities' | 'moves';

interface EnciclopediaProps {
  initialMoves: any[];
  initialAbilities: any[];
}

const typeTranslations: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

const categoryTranslations: Record<string, string> = {
  'physical': 'Físico',
  'special': 'Especial',
  'status': 'Estado',
};

export default function Enciclopedia({ initialMoves, initialAbilities }: EnciclopediaProps) {
  const [activeTab, setActiveTab] = useState<Tab>('types');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(20);
  
  const filteredTypes = useMemo(() => {
    return Object.keys(typeEffectiveness).filter(type =>
      typeTranslations[type]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  const filteredAbilities = useMemo(() => {
    return initialAbilities.filter(ability =>
      ability.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ability.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, initialAbilities]);
  
  const filteredMoves = useMemo(() => {
    return initialMoves.filter(move =>
      move.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      move.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      move.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, initialMoves]);
  
  // Aplicar límite de visualización
  const displayedAbilities = filteredAbilities.slice(0, displayLimit);
  const displayedMoves = filteredMoves.slice(0, displayLimit);
  
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white">
          Enciclopedia Pokémon
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Explora información detallada sobre tipos, habilidades y movimientos Pokémon.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-300 dark:border-gray-700 mb-6">
        <div className="flex gap-8 px-4 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('types');
              setSearchQuery('');
            }}
            className={`pb-3 pt-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'types'
                ? 'border-[#e4290c] text-[#e4290c]'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <p className="text-sm font-bold">Tipos</p>
          </button>
          <button
            onClick={() => {
              setActiveTab('abilities');
              setSearchQuery('');
              setDisplayLimit(20);
            }}
            className={`pb-3 pt-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'abilities'
                ? 'border-[#e4290c] text-[#e4290c]'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <p className="text-sm font-bold">Habilidades ({initialAbilities.length})</p>
          </button>
          <button
            onClick={() => {
              setActiveTab('moves');
              setSearchQuery('');
              setDisplayLimit(20);
            }}
            className={`pb-3 pt-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'moves'
                ? 'border-[#e4290c] text-[#e4290c]'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <p className="text-sm font-bold">Movimientos ({initialMoves.length})</p>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'types' ? 'Buscar tipo...' :
              activeTab === 'abilities' ? 'Buscar habilidad...' :
              'Buscar movimiento...'
            }
            className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#e4290c] focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4">
        {activeTab === 'types' && (
          <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Débil contra
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Resistente a
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                    Inmune a
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.map((type, index) => {
                  const typeData = typeEffectiveness[type];
                  return (
                    <tr
                      key={type}
                      className={index > 0 ? 'border-t border-gray-200 dark:border-gray-800' : ''}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/icons/types/${type}.svg`}
                            alt={type}
                            className="w-6 h-6"
                          />
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {typeTranslations[type]}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {typeData.weakTo.length > 0 ? (
                            typeData.weakTo.map(t => (
                              <img
                                key={t}
                                src={`/icons/types/${t}.svg`}
                                alt={t}
                                className="w-5 h-5"
                                title={typeTranslations[t]}
                              />
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {typeData.resistantTo.length > 0 ? (
                            typeData.resistantTo.slice(0, 6).map(t => (
                              <img
                                key={t}
                                src={`/icons/types/${t}.svg`}
                                alt={t}
                                className="w-5 h-5"
                                title={typeTranslations[t]}
                              />
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                          {typeData.resistantTo.length > 6 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{typeData.resistantTo.length - 6}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {typeData.immuneTo.length > 0 ? (
                            typeData.immuneTo.map(t => (
                              <img
                                key={t}
                                src={`/icons/types/${t}.svg`}
                                alt={t}
                                className="w-5 h-5"
                                title={typeTranslations[t]}
                              />
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTypes.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron tipos
                </p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'abilities' && (
          <>
            <div className="space-y-4">
              {displayedAbilities.map((ability) => (
                <div
                  key={ability.name}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                        {ability.spanish}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {ability.name.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm leading-relaxed">
                    {ability.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Pokémon:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ability.pokemon.slice(0, 5).map((pokemon: string, i: number) => (
                        <span
                          key={i}
                          className="text-gray-900 dark:text-white capitalize"
                        >
                          {pokemon.replace('-', ' ')}
                          {i < Math.min(4, ability.pokemon.length - 1) && ','}
                        </span>
                      ))}
                      {ability.totalPokemon > 5 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          +{ability.totalPokemon - 5} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredAbilities.length === 0 && (
                <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron habilidades
                  </p>
                </div>
              )}
            </div>
            
            {/* Botón Cargar Más - Habilidades */}
            {filteredAbilities.length > displayLimit && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 20)}
                  className="px-6 py-3 bg-[#e4290c] text-white rounded-full font-medium hover:bg-[#c02209] transition-colors"
                >
                  Cargar más habilidades ({filteredAbilities.length - displayLimit} restantes)
                </button>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'moves' && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Movimiento
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Poder
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Precisión
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                      PP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMoves.map((move, index) => (
                    <tr
                      key={move.name}
                      className={index > 0 ? 'border-t border-gray-200 dark:border-gray-800' : ''}
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {move.spanish}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {move.description.replace(/\$effect_chance/g, '').trim()}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/icons/types/${move.type}.svg`}
                            alt={move.type}
                            className="w-5 h-5"
                          />
                          <span className="text-sm capitalize text-gray-900 dark:text-white">
                            {typeTranslations[move.type] || move.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          move.category === 'physical'
                            ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                            : move.category === 'special'
                            ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                            : 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
                        }`}>
                          {categoryTranslations[move.category] || move.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {move.power}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {move.accuracy === '-' ? '-' : `${move.accuracy}%`}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {move.pp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMoves.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron movimientos
                  </p>
                </div>
              )}
            </div>
            
            {/* Botón Cargar Más - Movimientos */}
            {filteredMoves.length > displayLimit && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setDisplayLimit(prev => prev + 20)}
                  className="px-6 py-3 bg-[#e4290c] text-white rounded-full font-medium hover:bg-[#c02209] transition-colors"
                >
                  Cargar más movimientos ({filteredMoves.length - displayLimit} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
