import { useState } from 'react';

interface FilterButtonsProps {
  onTypeFilter: (type: string | null) => void;
  onGenerationFilter: (gen: number | null) => void;
  onStatFilter: (stat: string | null, order: 'asc' | 'desc') => void;
}

const pokemonTypes = [
  { name: 'Normal', value: 'normal', color: '#a8a878' },
  { name: 'Fuego', value: 'fire', color: '#f08030' },
  { name: 'Agua', value: 'water', color: '#6890f0' },
  { name: 'Planta', value: 'grass', color: '#78c850' },
  { name: 'Eléctrico', value: 'electric', color: '#f8d030' },
  { name: 'Hielo', value: 'ice', color: '#98d8d8' },
  { name: 'Lucha', value: 'fighting', color: '#c03028' },
  { name: 'Veneno', value: 'poison', color: '#a040a0' },
  { name: 'Tierra', value: 'ground', color: '#e0c068' },
  { name: 'Volador', value: 'flying', color: '#a890f0' },
  { name: 'Psíquico', value: 'psychic', color: '#f85888' },
  { name: 'Bicho', value: 'bug', color: '#a8b820' },
  { name: 'Roca', value: 'rock', color: '#b8a038' },
  { name: 'Fantasma', value: 'ghost', color: '#705898' },
  { name: 'Dragón', value: 'dragon', color: '#7038f8' },
  { name: 'Siniestro', value: 'dark', color: '#705848' },
  { name: 'Acero', value: 'steel', color: '#b8b8d0' },
  { name: 'Hada', value: 'fairy', color: '#ee99ac' },
];

const generations = [
  { name: 'Gen I', value: 1, range: [1, 151] },
  { name: 'Gen II', value: 2, range: [152, 251] },
  { name: 'Gen III', value: 3, range: [252, 386] },
  { name: 'Gen IV', value: 4, range: [387, 493] },
  { name: 'Gen V', value: 5, range: [494, 649] },
  { name: 'Gen VI', value: 6, range: [650, 721] },
  { name: 'Gen VII', value: 7, range: [722, 809] },
  { name: 'Gen VIII', value: 8, range: [810, 905] },
  { name: 'Gen IX', value: 9, range: [906, 1025] },
];

const stats = [
  { name: 'HP', value: 'hp' },
  { name: 'Ataque', value: 'attack' },
  { name: 'Defensa', value: 'defense' },
  { name: 'Atq. Esp.', value: 'special-attack' },
  { name: 'Def. Esp.', value: 'special-defense' },
  { name: 'Velocidad', value: 'speed' },
];

export default function FilterButtons({ onTypeFilter, onGenerationFilter, onStatFilter }: FilterButtonsProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showGenMenu, setShowGenMenu] = useState(false);
  const [showStatMenu, setShowStatMenu] = useState(false);
  
  const handleTypeClick = (type: string) => {
    const newType = selectedType === type ? null : type;
    setSelectedType(newType);
    onTypeFilter(newType);
    setShowTypeMenu(false);
  };
  
  const handleGenClick = (gen: number) => {
    const newGen = selectedGen === gen ? null : gen;
    setSelectedGen(newGen);
    onGenerationFilter(newGen);
    setShowGenMenu(false);
  };
  
  const handleStatClick = (stat: string) => {
    const newStat = selectedStat === stat ? null : stat;
    setSelectedStat(newStat);
    onStatFilter(newStat, 'desc'); // Por defecto ordenar de mayor a menor
    setShowStatMenu(false);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filtro por Tipo */}
      <div className="relative">
        <button
          onClick={() => {
            setShowTypeMenu(!showTypeMenu);
            setShowGenMenu(false);
            setShowStatMenu(false);
          }}
          className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 px-4 transition-colors hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
            category
          </span>
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {selectedType ? pokemonTypes.find(t => t.value === selectedType)?.name : 'Tipo'}
          </p>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            expand_more
          </span>
        </button>
        
        {showTypeMenu && (
          <div className="absolute top-full mt-2 z-50 min-w-[200px] max-h-[400px] overflow-y-auto rounded-lg bg-white dark:bg-[#282a2c] shadow-lg p-2">
            {pokemonTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeClick(type.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  selectedType === type.value ? 'bg-gray-100 dark:bg-white/10' : ''
                }`}
              >
                <img 
                  src={`/icons/types/${type.value}.svg`} 
                  alt={type.name}
                  className="w-5 h-5"
                  style={{ filter: `drop-shadow(0 0 2px ${type.color})` }}
                />
                <span className="text-sm font-medium">{type.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Filtro por Generación */}
      <div className="relative">
        <button
          onClick={() => {
            setShowGenMenu(!showGenMenu);
            setShowTypeMenu(false);
            setShowStatMenu(false);
          }}
          className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 px-4 transition-colors hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
            tag
          </span>
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {selectedGen ? `Gen ${selectedGen}` : 'Generación'}
          </p>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            expand_more
          </span>
        </button>
        
        {showGenMenu && (
          <div className="absolute top-full mt-2 z-50 min-w-[150px] rounded-lg bg-white dark:bg-[#282a2c] shadow-lg p-2">
            {generations.map((gen) => (
              <button
                key={gen.value}
                onClick={() => handleGenClick(gen.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  selectedGen === gen.value ? 'bg-gray-100 dark:bg-white/10' : ''
                }`}
              >
                <span className="text-sm font-medium">{gen.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Filtro por Estadísticas */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStatMenu(!showStatMenu);
            setShowTypeMenu(false);
            setShowGenMenu(false);
          }}
          className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-200 px-4 transition-colors hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
            bar_chart
          </span>
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {selectedStat ? stats.find(s => s.value === selectedStat)?.name : 'Estadísticas'}
          </p>
          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
            expand_more
          </span>
        </button>
        
        {showStatMenu && (
          <div className="absolute top-full mt-2 z-50 min-w-[150px] rounded-lg bg-white dark:bg-[#282a2c] shadow-lg p-2">
            {stats.map((stat) => (
              <button
                key={stat.value}
                onClick={() => handleStatClick(stat.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 ${
                  selectedStat === stat.value ? 'bg-gray-100 dark:bg-white/10' : ''
                }`}
              >
                <span className="text-sm font-medium">{stat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Divisor */}
      <div className="hidden h-8 w-px bg-gray-300 dark:bg-white/20 sm:block"></div>
      
      {/* Botones de tipo rápido (primeros 3) */}
      {pokemonTypes.slice(0, 3).map((type) => (
        <button
          key={type.value}
          onClick={() => handleTypeClick(type.value)}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${
            selectedType === type.value
              ? 'ring-2 ring-offset-2 ring-offset-[#f8f6f5] dark:ring-offset-[#1F1F2D]'
              : ''
          }`}
          style={{
            backgroundColor: `${type.color}33`,
            color: type.color,
            ...(selectedType === type.value && { ringColor: type.color })
          }}
        >
          <img 
            src={`/icons/types/${type.value}.svg`} 
            alt={type.name}
            className="w-4 h-4"
          />
          <p className="text-sm font-medium">{type.name}</p>
        </button>
      ))}
    </div>
  );
}