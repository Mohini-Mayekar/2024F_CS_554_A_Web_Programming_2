// This file should set up the express server as shown in the lecture code

const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient();
client.connect().then(() => { });
const configRoutes = require('./routes/index.js')

app.use(express.json());

app.get('/api/pokemon/', async (req, res, next) => {
    //check cache
    if (req.originalUrl === '/api/pokemon/' || req.originalUrl === '/api/pokemon') {
        let exists = await client.exists('pokemonsList');
        if (exists) {
            let pokemonsList = await client.get('pokemonsList');
            pokemonsList = JSON.parse(pokemonsList);
            return res.status(200).json(pokemonsList);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.get('/api/pokemon/:id', async (req, res, next) => {
    //check cache
    if (req.originalUrl !== '/api/pokemon/history') {
        let exists = await client.exists('pokemon_' + req.params.id);
        if (exists) {
            let pokemon = await client.get('pokemon_' + req.params.id);
            //insert into history list
            await client.lPush('pokemonHistory', pokemon);
            pokemon = JSON.parse(pokemon);
            return res.status(200).json(pokemon);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.get('/api/move/', async (req, res, next) => {
    //check cache
    if (req.originalUrl === '/api/move/' || req.originalUrl === '/api/move') {
        let exists = await client.exists('movesList');
        if (exists) {
            let movesList = await client.get('movesList');
            movesList = JSON.parse(movesList);
            return res.status(200).json(movesList);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.get('/api/move/:id', async (req, res, next) => {
    //check cache
    let exists = await client.exists('move_' + req.params.id);
    if (exists) {
        let move = await client.get('move_' + req.params.id);
        move = JSON.parse(move);
        return res.status(200).json(move);
    } else {
        next();
    }
});

app.get('/api/item/', async (req, res, next) => {
    //check cache
    if (req.originalUrl === '/api/item/' || req.originalUrl === '/api/item') {
        let exists = await client.exists('itemsList');
        if (exists) {
            let itemsList = await client.get('itemsList');
            itemsList = JSON.parse(itemsList);
            return res.status(200).json(itemsList);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.get('/api/item/:id', async (req, res, next) => {
    //check cache
    let exists = await client.exists('item_' + req.params.id);
    if (exists) {
        let item = await client.get('item_' + req.params.id);
        item = JSON.parse(item);
        return res.status(200).json(item);
    } else {
        next();
    }
});

configRoutes(app);
app.listen(3000, () => {
    console.log("We've mow got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});