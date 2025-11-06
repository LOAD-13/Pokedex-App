import { getTypeColor } from '../../utils/colors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const color = getTypeColor(type);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
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
  
  return (
    <span
      className={`flex items-center rounded-full font-semibold ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}33`,
        color: color,
      }}
    >
      <img 
        src={`/icons/types/${type.toLowerCase()}.svg`} 
        alt={type}
        className={`${iconSizes[size]} filter-type-icon`}
        style={{ filter: 'brightness(0) saturate(100%)' }}
      />
      {typeTranslations[type.toLowerCase()] || type}
    </span>
  );
}