import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = '¿Qué Pokémon buscas?' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);
  
  return (
    <div className="relative flex w-full flex-1 items-stretch">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        search
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-14 w-full min-w-0 flex-1 rounded-full border-gray-300 bg-gray-100 pl-12 text-lg text-gray-900 placeholder:text-gray-500 focus:border-[#e4290c] focus:ring-[#e4290c] dark:border-white/20 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400"
        placeholder={placeholder}
      />
    </div>
  );
}