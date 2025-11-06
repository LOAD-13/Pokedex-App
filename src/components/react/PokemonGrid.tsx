import { useState, useEffect, useMemo } from 'react';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import FilterButtons from './FilterButtons';
import type { PokemonListItem } from '../../types/pokemon';

interface PokemonGridProps {
  initialPokemon: PokemonListItem[];
}

export default function PokemonGrid({ initialPokemon }: PokemonGridProps) {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>(initialPokemon);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [genFilter, setGenFilter] = useState<number | null>(null);
  const [statFilter, setStatFilter] = useState<{stat: string | null, order: 'asc' | 'desc'}>({ stat: null, order: 'desc' });
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  
  const filteredPokemon = useMemo(() => {
    let result = pokemon.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.id.toString().includes(searchQuery);
      const matchesType = !typeFilter || p.types.includes(typeFilter);
      
      let matchesGen = true;
      if (genFilter) {
        const ranges: Record<number, [number, number]> = {
          1: [1, 151],
          2: [152, 251],
          3: [252, 386],
          4: [387, 493],
          5: [494, 649],
          6: [650, 721],
          7: [722, 809],
          8: [810, 905],
          9: [906, 1025],
        };
        const [min, max] = ranges[genFilter] || [0, 9999];
        matchesGen = p.id >= min && p.id <= max;
      }
      
      return matchesSearch && matchesType && matchesGen;
    });
    
    // Ordenar por estadística si está seleccionada
    if (statFilter.stat) {
      // Por ahora ordenamos por ID (necesitarías agregar stats a PokemonListItem para ordenar por stats reales)
      result.sort((a, b) => {
        if (statFilter.order === 'desc') {
          return b.id - a.id;
        } else {
          return a.id - b.id;
        }
      });
    }
    
    return result;
  }, [pokemon, searchQuery, typeFilter, genFilter, statFilter]);
  
  const displayedPokemon = filteredPokemon.slice(0, displayCount);
  const hasMore = displayCount < filteredPokemon.length;
  
  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoading(false);
    }, 500);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !isLoading
      ) {
        loadMore();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);
  
  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery, typeFilter, genFilter, statFilter]);
  
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 text-center mb-8">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Explora el Mundo Pokémon
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Busca, filtra y descubre todos los Pokémon en una enciclopedia interactiva.
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="sticky top-[65px] z-40 bg-[#f8f6f5]/80 dark:bg-[#1F1F2D]/80 py-4 backdrop-blur-sm">
        <div className="mb-4">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <FilterButtons 
          onTypeFilter={setTypeFilter} 
          onGenerationFilter={setGenFilter}
          onStatFilter={(stat, order) => setStatFilter({ stat, order })}
        />
      </div>
      
      {/* Results Count */}
      {(searchQuery || typeFilter || genFilter || statFilter.stat) && (
        <div className="mt-6 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-white">{filteredPokemon.length}</span> Pokémon
            {searchQuery && <> con "<span className="font-semibold">{searchQuery}</span>"</>}
            {typeFilter && <> de tipo <span className="font-semibold capitalize">{typeFilter}</span></>}
            {genFilter && <> de la <span className="font-semibold">Gen {genFilter}</span></>}
          </p>
        </div>
      )}
      
      {/* Pokemon Grid */}
      <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {displayedPokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>
      
      {/* Loading Indicator */}
      {(isLoading || hasMore) && filteredPokemon.length > 0 && (
        <div className="mt-12 flex justify-center py-8">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e4290c] border-t-transparent"></div>
            <span className="font-medium">Cargando más Pokémon...</span>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {filteredPokemon.length === 0 && (
        <div className="mt-12 text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 block">
            search_off
          </span>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            No se encontraron Pokémon
          </p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">
            Intenta con otros términos de búsqueda o filtros
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter(null);
              setGenFilter(null);
              setStatFilter({ stat: null, order: 'desc' });
            }}
            className="mt-4 px-6 py-2 bg-[#e4290c] text-white rounded-full hover:bg-[#c02209] transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
      
      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#e4290c] text-white shadow-lg transition-transform hover:scale-110 z-50"
        aria-label="Volver arriba"
      >
        <span className="material-symbols-outlined">arrow_upward</span>
      </button>
    </div>
  );
}