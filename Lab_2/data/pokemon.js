// This data file should export all functions using the ES6 standard as shown in the lecture code

const axios = require('axios');
const helper = require('../helpers.js');

const getPokemons = async () => {
  const pokemonsData = await axios.get(helper.pokemonUrl);
  if (pokemonsData == null) throw 'No data found';
  return pokemonsData.data;
};

const getPokemonById = async (id) => {
  const pokemonData = await axios.get(helper.pokemonUrl + id + '/');
  if (pokemonData == null) throw 'No data found for pokemon';
  return pokemonData;
};

export default {
  getPokemons, getPokemonById
}