import { useState } from 'react';
import TypeBadge from './TypeBadge';
import { formatPokemonId, formatHeight, formatWeight, formatStatName, capitalizeFirst } from '../../utils/helpers';

interface PokemonDetailProps {
  pokemonData: {
    pokemon: any;
    description: string;
    evolutionChain: any[];
    moves: any[];
  };
}

export default function PokemonDetail({ pokemonData }: PokemonDetailProps) {
  const { pokemon, description, evolutionChain, moves } = pokemonData;
  const [isShiny, setIsShiny] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'moves' | 'evolution'>('about');
  
  const maxStat = 255;
  
  const currentSprite = isShiny 
    ? pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  
  return (
    <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
      <div className="flex w-full flex-col max-w-6xl flex-1 gap-6 md:gap-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center gap-2 px-0 py-3">
          <div className="flex gap-2">
            <a 
              href="/" 
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#e4290c] dark:hover:text-[#e4290c] transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </a>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#e4290c] dark:hover:text-[#e4290c] transition-colors">
              <span className="material-symbols-outlined">favorite_border</span>
            </button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Image & Types */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between items-baseline gap-3 px-0">
              <h1 className="text-slate-900 dark:text-white text-5xl md:text-6xl font-black tracking-tighter capitalize">
                {pokemon.name}
              </h1>
              <span className="text-[#48D0B0] text-4xl md:text-5xl font-bold tracking-tighter">
                {formatPokemonId(pokemon.id)}
              </span>
            </div>
            
            {/* Pokemon Image */}
            <div className="relative w-full aspect-square bg-slate-100 dark:bg-[#282a2c] rounded-xl flex items-center justify-center p-4">
              <img
                src={currentSprite}
                alt={`${isShiny ? 'Shiny ' : ''}${pokemon.name}`}
                className="max-w-full max-h-full object-contain h-3/4 transition-all duration-300"
              />
            </div>
            
            {/* Sprite Toggle (Normal/Shiny) */}
            <div className="flex px-0">
              <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-slate-200 dark:bg-[#282a2c] p-1.5">
                <button
                  onClick={() => setIsShiny(false)}
                  className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-4 text-base font-medium transition-colors ${
                    !isShiny 
                      ? 'bg-white dark:bg-[#1a1c1e] shadow-sm text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="truncate">Normal</span>
                </button>
                <button
                  onClick={() => setIsShiny(true)}
                  className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-4 text-base font-medium transition-colors ${
                    isShiny 
                      ? 'bg-white dark:bg-[#1a1c1e] shadow-sm text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span className="truncate">Shiny</span>
                </button>
              </div>
            </div>
            
            {/* Types with Icons */}
            <div className="flex gap-3 px-0 flex-wrap">
              {pokemon.types.map((type: any) => (
                <div 
                  key={type.type.name}
                  className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 uppercase tracking-wide" 
                  style={{ backgroundColor: `var(--type-${type.type.name})` }}
                >
                  <img 
                    src={`/icons/types/${type.type.name}.svg`}
                    alt={type.type.name}
                    className="w-5 h-5 brightness-0 invert"
                  />
                  <p className="text-white text-sm font-bold">{type.type.name}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Details */}
          <div className="flex flex-col gap-6">
            
            {/* Tabs */}
            <div className="w-full">
              <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'about' 
                      ? 'text-[#48D0B0] border-b-2 border-[#48D0B0]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'stats' 
                      ? 'text-[#48D0B0] border-b-2 border-[#48D0B0]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Stats
                </button>
                <button 
                  onClick={() => setActiveTab('moves')}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'moves' 
                      ? 'text-[#48D0B0] border-b-2 border-[#48D0B0]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Moves
                </button>
                <button 
                  onClick={() => setActiveTab('evolution')}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                    activeTab === 'evolution' 
                      ? 'text-[#48D0B0] border-b-2 border-[#48D0B0]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Evolution
                </button>
              </div>
              
              <div className="py-6 space-y-8">
                
                {/* TAB: About */}
                {activeTab === 'about' && (
                  <>
                    <div className="space-y-4">
                      <p className="text-base leading-relaxed">{description}</p>
                      
                      {/* Height & Weight */}
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-100 dark:bg-[#282a2c]">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {formatHeight(pokemon.height)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">
                            {formatWeight(pokemon.weight)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Abilities */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Abilities</h3>
                      <div className="space-y-3">
                        {pokemon.abilities.map((ability: any) => (
                          <div key={ability.ability.name} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className={`font-semibold ${ability.is_hidden ? 'text-slate-600 dark:text-slate-300' : ''}`}>
                              {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                              {ability.is_hidden && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">(Hidden)</span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* TAB: Stats */}
                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Base Stats</h3>
                    <div className="space-y-3">
                      {pokemon.stats.map((stat: any) => {
                        const percentage = (stat.base_stat / maxStat) * 100;
                        return (
                          <div key={stat.stat.name} className="grid grid-cols-[80px_1fr_40px] items-center gap-x-3">
                            <span className="font-medium text-sm text-slate-500 dark:text-slate-400">
                              {formatStatName(stat.stat.name)}
                            </span>
                            <div className="w-full h-2 rounded-full bg-[#48D0B0]/20">
                              <div 
                                className="h-2 rounded-full bg-[#48D0B0] transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-sm text-right">{stat.base_stat}</span>
                          </div>
                        );
                      })}
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-[80px_1fr_40px] items-center gap-x-3">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            Total
                          </span>
                          <div></div>
                          <span className="font-bold text-sm text-right text-[#48D0B0]">
                            {pokemon.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* TAB: Moves */}
                {activeTab === 'moves' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Level-Up Moves</h3>
                    {moves.length > 0 ? (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {moves.map((move: any, index: number) => (
                          <div 
                            key={`${move.name}-${index}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-[#282a2c] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <span className="font-medium capitalize">
                              {move.name.replace('-', ' ')}
                            </span>
                            <span className="text-sm font-bold text-[#48D0B0]">
                              Lv. {move.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">No level-up moves found.</p>
                    )}
                  </div>
                )}
                
                {/* TAB: Evolution */}
                {activeTab === 'evolution' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Evolution Chain</h3>
                    {evolutionChain.length > 1 ? (
                      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                        {evolutionChain.map((evo: any, index: number) => (
                          <div key={evo.id} className="flex items-center gap-2">
                            <div className="flex flex-col items-center gap-2 min-w-[80px]">
                              <a 
                                href={`/pokemon/${evo.id}`}
                                className="p-2 bg-slate-100 dark:bg-[#282a2c] rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              >
                                <img
                                  className="w-16 h-16"
                                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                                  alt={`Sprite of ${evo.name}`}
                                />
                              </a>
                              <span className="font-semibold text-sm capitalize text-center">
                                {evo.name}
                              </span>
                            </div>
                            
                            {index < evolutionChain.length - 1 && (
                              <div className="flex flex-col items-center text-center text-[#48D0B0] min-w-[60px]">
                                <span className="material-symbols-outlined">arrow_forward</span>
                                {evolutionChain[index + 1].minLevel && (
                                  <span className="text-xs font-bold">Level {evolutionChain[index + 1].minLevel}</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">This Pokémon does not evolve.</p>
                    )}
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}