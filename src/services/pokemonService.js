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
const getPokemons = async (page, limit = 200) => {
  try {
    const startId = (page - 1) * limit + 1;
    const endId = startId + limit;
    const pokemonsWithImages = [];

    for (let id = startId; id < endId; id++) {
      const pokemonDetailResponse = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
      const pokemon = pokemonDetailResponse.data;
      pokemonsWithImages.push({
        name: pokemon.name,
        image: pokemon.sprites.front_default
      });
    }

    return pokemonsWithImages;
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    throw error;
  }
};

const getTotalPages = async (limit) => {
  try {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`);
    const totalPokemons = response.data.count;
    return Math.ceil(totalPokemons / limit);
  } catch (error) {
    console.error('Error fetching total number of pokemons:', error);
    throw error;
  }
};

export { getPokemonInfo, getPokemons, getTotalPages };
