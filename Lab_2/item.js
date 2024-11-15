// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!

const express = require('express');
const redis = require('redis');
const router = express.Router();
const client = redis.createClient();
client.connect().then(() => { });

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const itemsList = await getItems();
      await client.set('itemsList', itemsList);
      return res.json(itemsList);
    } catch (e) {
      return errHandler(res, e);
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = checkisValidId(req.params.id, 'itemId');
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const item = await getItemById(req.params.id);
      await client.set('item_' + req.params.id, pokemon);
      return res.json(item);
    } catch (e) {
      return res.status(404).json({ error: e });
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
  return itemData;
};

const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
const moveUrl = 'https://pokeapi.co/api/v2/move/';
const itemUrl = 'https://pokeapi.co/api/v2/item/';

let errHandler = (res, e) => {
  let statusCode = 500;
  if (e == 'Invalid URL') statusCode = 400;
  else if (e.toString().includes('Not Found')) statusCode = 404;
  return res.status(statusCode).json({ error: e });
};

let checkisValidId = (id, variable) => {
  if (id === undefined || id === null) throw `All fields need to be supplied. Input for '${variable || 'provided variable'}' param is undefined or null.`;
  //check input type is string
  if (typeof id !== 'string') throw `Input '${variable || 'provided'}' of value '${id || 'provided variable'}' is not a string.`;
  //empty string or has only spaces
  if ((id.replaceAll(/\s/g, '').length) === 0) throw `Input '${variable || 'provided'}' string of value '${id}' has just spaces or is an empty string.`;
  id = id.trim();
  //check for int value
  if (typeof parseInt(id) !== 'number' || isNaN(parseInt(id))) throw `Input '${variable || 'provided'}' of value '${id || 'provided variable'}' is not a number.`;
  return id;
};

module.exports = router;