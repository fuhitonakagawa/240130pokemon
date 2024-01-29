import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// ポケモンの情報を取得する関数
const getPokemonInfo = async (pokemonName) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${pokemonName}`);
    return {
      name: response.data.name,
      image: response.data.sprites.front_default
    };
  } catch (error) {
    console.error('Error fetching pokemon info:', error);
    throw error;
  }
};

// ポケモン一覧を取得する関数
const getPokemons = async () => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon?limit=50`);
    const pokemonList = response.data.results;

    const pokemonsWithImages = await Promise.all(pokemonList.map(async (pokemon) => {
      const pokemonDetail = await axios.get(pokemon.url);
      const image = pokemonDetail.data.sprites.front_default;
      return {
        name: pokemon.name,
        image
      };
    }));

    return pokemonsWithImages;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    throw error;
  }
};


export { getPokemonInfo, getPokemons };
