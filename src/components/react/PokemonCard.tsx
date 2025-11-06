import { useState } from 'react';
import TypeBadge from './TypeBadge';
import { formatPokemonId } from '../../utils/helpers';
import type { PokemonListItem } from '../../types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <a
      href={`/pokemon/${pokemon.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg bg-gray-100 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e4290c]/20 dark:bg-white/5 animate-fade-in"
    >
      <div className="relative w-full aspect-square rounded-lg bg-gray-200 dark:bg-white/5 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e4290c] border-t-transparent"></div>
          </div>
        )}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      
      <div className="mt-3">
        <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
          {pokemon.name}
        </p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {formatPokemonId(pokemon.id)}
        </p>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
      </div>
    </a>
  );
}