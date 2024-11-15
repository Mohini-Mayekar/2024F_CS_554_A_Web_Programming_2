const pokeApiRoutes = require('./pokeApi.js');

const constructorMethod = (app) => {
    app.use('/api', pokeApiRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
};

module.exports = constructorMethod;