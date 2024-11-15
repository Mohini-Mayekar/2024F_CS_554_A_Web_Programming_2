// This data file should export all functions using the ES6 standard as shown in the lecture code

import axios from 'axios';
import { moveUrl } from '../helpers.js';

const getMoves = async () => {
  const movesData = await axios.get(moveUrl);
  if (movesData == null) throw 'No data found';
  return movesData.data;
};

const getMoveById = async (id) => {
  const pokemonData = await axios.get(moveUrl + id + '/');
  if (pokemonData == null) throw 'No data found for move';
  return pokemonData;
};

export default {
  getMoves, getMoveById
}