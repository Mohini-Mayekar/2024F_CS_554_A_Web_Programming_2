// This data file should export all functions using the ES6 standard as shown in the lecture code

import axios from 'axios';
import { itemUrl } from '../helpers.js';

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

export default {
  getItems, getItemById
}