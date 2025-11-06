export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: {
      front_default: string;
      front_shiny: string;
      other: {
        'official-artwork': {
          front_default: string;
          front_shiny: string;
        };
      };
    };
    height: number;
    weight: number;
    abilities: Ability[];
    stats: Stat[];
    species: {
      url: string;
    };
    moves: PokemonMove[];
  }
  
  export interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  export interface Ability {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }
  
  export interface Stat {
    base_stat: number;
    stat: {
      name: string;
    };
  }

  export interface PokemonMove {
    move: {
      name: string;
      url: string;
    };
    version_group_details: VersionGroupDetail[];
  }

  export interface VersionGroupDetail {
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }
  
  export interface PokemonSpecies {
    evolution_chain: {
      url: string;
    };
    flavor_text_entries: Array<{
      flavor_text: string;
      language: {
        name: string;
      };
    }>;
  }
  
  export interface EvolutionChain {
    chain: ChainLink;
  }
  
  export interface ChainLink {
    species: {
      name: string;
      url: string;
    };
    evolves_to: ChainLink[];
    evolution_details: Array<{
      min_level: number | null;
      trigger: {
        name: string;
      };
    }>;
  }
  
  export interface PokemonListItem {
    id: number;
    name: string;
    types: string[];
    sprite: string;
  }