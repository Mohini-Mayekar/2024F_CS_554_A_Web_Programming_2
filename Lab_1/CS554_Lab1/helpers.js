// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import { movies } from './config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { moviesData } from './data/index.js';

const pattern = new RegExp(/^[a-zA-Z\s]{2,25}$/);

let checkUndefinedOrNull = (obj, variable) => {
    if (obj === undefined || obj === null) throw `All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`;
};

let errMsg = (e) => {
    return (e.message) ? e.message : e;
};

let checkQueryParam = (query, variable, isRoute) => {
    if (query === undefined || query === null) return variable == 'skip' ? 0 : 20;
    if (isRoute)
        query = checkisValidString(query, variable);
    query = parseInt(query);
    checkisValidNumber(query, variable);
    if (variable == 'take') {
        query = (query > 100) ? 100 : query;
    }
    if (isRoute)
        if (query < 1) throw `${variable || 'provided variable'} should be a positive number.`;
    return query;
};

let checkQueryParamKey = (queryParams) => {
    Object.keys(queryParams).forEach(key => {
        let keyLowerCase = key.toLowerCase().trim();
        if (keyLowerCase === 'skip' || keyLowerCase === 'take') {
            if (keyLowerCase !== key) throw `Invalid query param '${key}'. `;
        }
    });
};

let checkIfPresent = (obj) => {
    return (!(obj === undefined || obj === null));
};

let checkisValidString = (str, variable) => {
    //check input type is string
    if (typeof str !== 'string') throw `Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is not a string.`;
    //empty string or has only spaces
    if ((str.replaceAll(/\s/g, '').length) === 0) throw `Input '${variable || 'provided'}' string of value '${str}' has just spaces or is an empty string.`;
    return str.trim();
};

let checkisValidName = (str, variable) => {
    if (!(pattern.test(str))) throw `Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is invalid.`;
};

let checkisValidNumber = (num, variable) => {
    if (typeof num !== 'number' || isNaN(num)) throw `Input '${variable || 'provided'}' of value '${num || 'provided variable'}' is not a number.`;
};

let checkisValidArray = (arr, variable) => {
    if (typeof arr !== 'object' || !(arr instanceof Array)) throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is not an array.`;
    if (arr.length == 0) throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is an empty array. It should contain at LEAST one element that's a valid string.`;
    for (let i in arr) {
        if (typeof arr[i] !== 'object') throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is not a proper input.`;
        checkUndefinedOrNull(arr[i].firstName, 'firstName');
        let firstName = arr[i].firstName;
        arr[i].firstName = checkisValidString(firstName, 'firstName');
        checkisValidName(arr[i].firstName, 'firstName');
        checkUndefinedOrNull(arr[i].lastName, 'lastName');
        let lastName = arr[i].lastName;
        checkisValidName(arr[i].lastName, 'lastName');
        arr[i].lastName = checkisValidString(lastName, 'lastName');
    }
    return arr;
};

let checkisValidYear = (year) => {
    if ((year < 1878) || (year > 2029)) throw `Invalid year passed in input '${year || 'provided'}'.`;
};

let checkisValidRating = (rating) => {
    checkisValidNumber(rating, 'rating');
    if ((rating < 1) || (rating > 5)) throw `Invalid rating passed in input '${rating || 'provided'}'. Acceptable rating range: 1 - 5`;
    return rating;
};

let checkisValidInfoObj = (obj, variable) => {
    if (typeof obj !== 'object') throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is not an object.`;
    checkUndefinedOrNull(obj.director, 'director');
    let director = obj.director;
    obj.director = checkisValidString(director, 'director');
    checkisValidName(obj.director, 'director');
    checkUndefinedOrNull(obj.yearReleased, 'yearReleased');
    checkisValidNumber(obj.yearReleased, 'yearReleased');
    checkisValidYear(obj.yearReleased);

    return obj;
};

let checkisValidInfoObjPatch = (obj, variable) => {
    if (typeof obj !== 'object') throw `Input '${variable || 'provided'}' of value '${arr || 'provided variable'}' is not an object.`;
    if (obj.director) {
        checkUndefinedOrNull(obj.director, 'director');
        let director = obj.director;
        obj.director = checkisValidString(director, 'director');
        checkisValidName(obj.director, 'director');
    }
    if (obj.yearReleased) {
        checkUndefinedOrNull(obj.yearReleased, 'yearReleased');
        checkisValidNumber(obj.yearReleased, 'yearReleased');
        checkisValidYear(obj.yearReleased);
    }
    return obj;
};

let updateInfoObj = (oldInfoObj, newInfoObj) => {
    if (newInfoObj.director) {
        oldInfoObj.director = newInfoObj.director;
    }
    if (newInfoObj.yearReleased) {
        oldInfoObj.yearReleased = newInfoObj.yearReleased;
    }
    return oldInfoObj;
};

let validateId = (id, variable) => {
    checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
};

let validateMovieInput = (
    movieId,
    title,
    cast,
    info,
    plot,
    rating,
    isUpdate
) => {
    //TO DO validate productId using isUpdate flag
    if (isUpdate) {
        checkUndefinedOrNull(movieId, 'movieId');
    }
    checkUndefinedOrNull(title, 'title');
    checkUndefinedOrNull(cast, 'cast');
    checkUndefinedOrNull(info, 'info');
    checkUndefinedOrNull(plot, 'plot');
    checkUndefinedOrNull(rating, 'rating');

    if (isUpdate) {
        movieId = checkisValidString(movieId, 'movieId');
        if (!ObjectId.isValid(movieId)) throw `invalid object ID '${movieId}'.`;
    }


    title = checkisValidString(title, 'title');
    cast = checkisValidArray(cast, 'cast');
    info = checkisValidInfoObj(info, 'info');
    plot = checkisValidString(plot, 'plot');

    rating = checkisValidRating(rating);


    let movie = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: []
    };
    return movie;
};

let validateMovieInputPatch = async (
    movieId,
    title,
    cast,
    info,
    plot,
    rating
) => {
    let isUpdatePatch = false;

    checkUndefinedOrNull(movieId, 'movieId');
    movieId = checkisValidString(movieId, 'movieId');
    if (!ObjectId.isValid(movieId)) throw `invalid object ID '${movieId}'.`;

    if (checkIfPresent(title)) {
        title = checkisValidString(title, 'title');
        isUpdatePatch = true;
    }

    if (checkIfPresent(cast)) {
        cast = checkisValidArray(cast, 'cast');
        isUpdatePatch = true;
    }

    if (checkIfPresent(info)) {
        info = checkisValidInfoObjPatch(info, 'info');
        isUpdatePatch = true;
    }

    if (checkIfPresent(plot)) {
        plot = checkisValidString(plot, 'plot');
        isUpdatePatch = true;
    }

    if (checkIfPresent(rating)) {
        rating = checkisValidRating(rating);
        isUpdatePatch = true;
    }

    if (!isUpdatePatch) throw `Input passed for patch update is invalid.`;

    const movie = await moviesData.getById(movieId);

    movie.title = (title) ? title : movie.title;
    movie.cast = (cast) ? cast : movie.cast;
    movie.info = (info) ? updateInfoObj(movie.info, info) : movie.info;
    movie.plot = (plot) ? plot : movie.plot;
    movie.rating = (rating) ? rating : movie.rating;

    return movie;
};



let updateMovie = async (movieId, movieObj) => {
    const moviesCollection = await movies();
    let updateInfo = await moviesCollection.findOneAndReplace(
        { _id: ObjectId.createFromHexString(movieId) },
        movieObj,
        { returnDocument: 'after' }
    );
    if (!updateInfo) {
        throw 'could not update product successfully';
    }
    return updateInfo;
};


export {
    validateId, validateMovieInput, validateMovieInputPatch, updateMovie, checkQueryParam, checkQueryParamKey, checkUndefinedOrNull, checkisValidName, checkisValidString, errMsg
}