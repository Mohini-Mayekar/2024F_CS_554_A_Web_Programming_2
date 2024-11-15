
const express = require('express');
const router = express.Router();
const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
client.connect().then(() => { });

router
  .route('/pokemon/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const pokemonsList = await getPokemons();
      let pokemonsListJsonStr = JSON.stringify(pokemonsList.results);
      await client.set('pokemonsList', pokemonsListJsonStr);
      return res.json(pokemonsList.results);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

router
  .route('/pokemon/history')
  .get(async (req, res) => {
    //code here for GET
    let pokemonHist = await client.lRange('pokemonHistory', 0, 24);
    let result = pokemonHist.map((ele) => {
      return JSON.parse(ele);
    });
    return res.json(result);
  });

router
  .route('/pokemon/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = checkisValidId(req.params.id, 'pokemonId');
    } catch (e) {
      return res.status(errStatusCode(e, 400)).json({ error: errMsg(e) });
    }
    try {
      const pokemon = await getPokemonById(req.params.id);
      let pokemonJsonStr = JSON.stringify(pokemon);
      await client.set('pokemon_' + req.params.id, pokemonJsonStr);
      await client.lPush('pokemonHistory', pokemonJsonStr);
      return res.json(pokemon);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

const getPokemons = async () => {
  const pokemonsData = await axios.get(pokemonUrl);
  if (pokemonsData == null) throw 'No data found';
  return pokemonsData.data;
};

const getPokemonById = async (id) => {
  const pokemonData = await axios.get(pokemonUrl + id + '/');
  if (pokemonData == null) throw 'No data found for pokemon';
  return pokemonData.data;
};

router
  .route('/move/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const movesList = await getMoves();
      let movesListJsonStr = JSON.stringify(movesList.results);
      await client.set('movesList', movesListJsonStr);
      return res.json(movesList.results);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

router
  .route('/move/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = checkisValidId(req.params.id, 'moveId');
    } catch (e) {
      return res.status(errStatusCode(e, 400)).json({ error: errMsg(e) });
    }
    try {
      const move = await getMoveById(req.params.id);
      let movesJsonStr = JSON.stringify(move);
      await client.set('move_' + req.params.id, movesJsonStr);
      return res.json(move);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

const getMoves = async () => {
  const movesData = await axios.get(moveUrl);
  if (movesData == null) throw 'No data found';
  return movesData.data;
};

const getMoveById = async (id) => {
  const pokemonData = await axios.get(moveUrl + id + '/');
  if (pokemonData == null) throw 'No data found for move';
  return pokemonData.data;
};

router
  .route('/item/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const itemsList = await getItems();
      let itemsListJsonStr = JSON.stringify(itemsList.results);
      await client.set('itemsList', itemsListJsonStr);
      return res.json(itemsList.results);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

router
  .route('/item/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = checkisValidId(req.params.id, 'itemId');
    } catch (e) {
      return res.status(errStatusCode(e, 400)).json({ error: errMsg(e) });
    }
    try {
      const item = await getItemById(req.params.id);
      let itemJsonStr = JSON.stringify(item);
      await client.set('item_' + req.params.id, itemJsonStr);
      return res.json(item);
    } catch (e) {
      return res.status(errStatusCode(e, 0)).json({ error: errMsg(e) });
    }
  });

const getItems = async () => {
  const itemsData = await axios.get(itemUrl);
  if (itemsData == null) throw 'No data found';
  return itemsData.data;
};

const getItemById = async (id) => {
  const itemData = await axios.get(itemUrl + id + '/');
  if (itemData == null) throw 'No data found for item';
  return itemData.data;
};

const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
const moveUrl = 'https://pokeapi.co/api/v2/move/';
const itemUrl = 'https://pokeapi.co/api/v2/item/';

let checkisValidId = (id, variable) => {
  if (id === undefined || id === null) throw `All fields need to be supplied. Input for '${variable || 'provided variable'}' param is undefined or null.`;
  //check input type is string
  if (typeof id !== 'string') throw `Input '${variable || 'provided'}' of value '${id || 'provided variable'}' is not a string.`;
  //empty string or has only spaces
  if ((id.replaceAll(/\s/g, '').length) === 0) throw `Input '${variable || 'provided'}' string of value '${id}' has just spaces or is an empty string.`;
  id = id.trim();
  //check for int value
  if (typeof parseInt(id) !== 'number' || isNaN(parseInt(id)) || parseInt(id) < 1) throw `Input '${variable || 'provided'}' of value '${id || 'provided variable'}' is not a positive number.`;
  return id;
};

let errMsg = (e) => {
  return (e.message) ? e.message : e;
};

let errStatusCode = (e, code) => {
  let statusCode = (code != 0) ? code : 500;
  if (e.toString().includes('Invalid URL') || e.toString().includes('400')) statusCode = 400;
  else if (e.toString().includes('Not Found') || e.toString().includes('404')) statusCode = 404;
  return statusCode;
};

module.exports = router;