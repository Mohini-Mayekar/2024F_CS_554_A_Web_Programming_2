// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is

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

export {
    pokemonUrl, moveUrl, itemUrl, errHandler, checkisValidId
}