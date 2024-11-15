// This file should set up the express server as shown in the lecture code

import express from 'express';
const app = express();
import configRoutesFunction from './routes/index.js';

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

let totalRequests = 0;
let urlCounts = {};

app.use(async (req, res, next) => {
    totalRequests++;
    console.log(`There have been ${totalRequests} requests made to the server`);
    next();
});

app.use(async (req, res, next) => {
    let reqBody = req.body;
    reqBody = JSON.stringify(reqBody);
    let url = req.originalUrl;
    let httpVerb = req.method;
    console.log(`${httpVerb} : ${url} : ${reqBody}`);
    next();
});

app.use(async (req, res, next) => {
    let url = req.originalUrl;
    if (!urlCounts[url]) {
        urlCounts[url] = 0;
    }
    urlCounts[url]++;
    console.log(`${url} request count: ${urlCounts[url]}`);
    next();
});

configRoutesFunction(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});