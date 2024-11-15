// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import { GraphQLError } from 'graphql';
import { ObjectId } from 'mongodb';
import {
    authors as authorCollection,
    books as bookCollection,
    publishers as publisherCollection,
    chapters as chapterCollection
} from './config/mongoCollections.js';
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => { });

const namePattern = new RegExp(/^[a-zA-Z\s]{2,25}$/);
const bookNameAndTitlePattern = new RegExp(/^(?=.*[A-Za-z0-9])[A-Za-z0-9](?:[A-Za-z0-9\s.,:;'&\-]*[A-Za-z0-9])?$/);
const locationPattern = new RegExp(/^[a-zA-Z\s]+,\s*[a-zA-Z\s]+$/);///^[a-zA-Z\s\-]+, [a-zA-Z]{2,3}$/

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
const NOT_FOUND = 'NOT_FOUND';
const BAD_REQUEST = 'BAD_REQUEST';
const validateRange = (min, max) => {
    if (min < 0) {
        throwError(`min should  be greater than 0.`, BAD_REQUEST);
    }
    if (min > max) {
        throwError(`min should be less than or equal to max.`, BAD_REQUEST);
    }
    let currYear = new Date().getFullYear;
    if (max > currYear + 5) {
        throwError(`max cannot be greater than 5 years from the current year.`, BAD_REQUEST);
    }
}

const validateYear = (year) => {
    if (year < 0) {
        throwError(`year should be greater than 0.`, BAD_REQUEST);
    }
    let currYear = new Date().getFullYear;
    if (year > currYear) {
        throwError(`year cannot be greater than current year.`, BAD_REQUEST);
    }
    return year;
}

const ifExist = async (key) => {
    let exists = await client.exists(key);
    if (exists) {
        console.log('cache');
        let cachedData = await client.get(key);
        return JSON.parse(cachedData);
    }
}

const cacheData = async (key, value, expireIn) => {
    value = JSON.stringify(value);
    if (expireIn) {
        await client.set(key, value);
        await client.expire(key, expireIn);
    } else {
        await client.set(key, value);
    }
}

const deleteFromCache = async (key) => {
    await client.del(key);
}

const deleteFromCacheKeyMatches = async (pattern) => {
    const keys = await client.keys(pattern);
    for (const i in keys) {
        await deleteFromCache(keys[i]);
    }
}

const deleteKeyMatches = async () => {
    const possibleKeys = ['search*', 'foundedYear*', 'genre*'];
    for (const i in possibleKeys) {
        await deleteFromCacheKeyMatches(possibleKeys[i]);
    }
}

const clearCache = async () => {
    await client.flushAll();
}

const throwError = (errMsg, codeTxt) => {
    throw new GraphQLError(errMsg, {
        extensions: { code: codeTxt }
    });
}

const addChapter = async (chapters, bookId) => {
    let len = chapters.length;
    for (let i = 0; i < len; i++) {
        let chapterObj = {
            _id: new ObjectId(),
            title: chapters[i],
            bookId: bookId
        };
        let insertedChapter = await books.insertOne(chapterObj);
        if (!insertedChapter.acknowledged || !insertedChapter.insertedId) {
            throwError(`Could not Add Chapter`, INTERNAL_SERVER_ERROR);
        }
        const _id = insertedChapter.insertedId;
        await resolvers.Query.getChapterById(_, { _id });
    }
}

let validateId = (id, variable) => {
    //checkUndefinedOrNull(id, variable);
    id = checkisValidString(id, variable);
    if (!ObjectId.isValid(id))
        throwError(`invalid object ID.`, BAD_REQUEST);
    return id;
};

let checkUndefinedOrNull = (obj, variable) => {
    if (obj === undefined || obj === null)
        throwError(`All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`, BAD_REQUEST);
};

let checkisValidString = (str, variable) => {
    checkUndefinedOrNull(str, variable);
    //check input type is string
    if (typeof str !== 'string')
        throwError(`Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is not a string.`, BAD_REQUEST);

    //empty string or has only spaces
    if ((str.replaceAll(/\s/g, '').length) === 0)
        throwError(`Input '${variable || 'provided'}' string of value '${str}' has just spaces or is an empty string.`, BAD_REQUEST);
    return str.trim();
};

let checkisValidName = (str, variable) => {
    str = checkisValidString(str, variable);
    if (!(namePattern.test(str)))
        throwError(`Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is invalid.`, BAD_REQUEST);
    return str;
};

let checkisValidTitle = (str, variable) => {
    str = checkisValidString(str, variable);
    if (!(bookNameAndTitlePattern.test(str)))
        throwError(`Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is invalid.`, BAD_REQUEST);
    return str;
}

let checkisValidDate = (date, variable) => {
    /**
       * If dateReleased is not a valid date in mm/dd/yyyy format then the method should throw. 
       * You will not have to take into account leap years but it must be a valid date. 
       * For example: 9/31/2022 would not be valid as there are not 31 days in September. 
       * 2/30/1995 would not be valid as there are never 30 days in Feb. 
       */
    date = checkisValidString(date, variable);
    if (!(date.includes("/")) || !(((date.split("/")).length) === 3))
        throwError(`Invalid date format '${date || 'provided'}'. '${variable}' expected format : 'mm/dd/yyyy'.`, BAD_REQUEST);
    let dateArr = date.split("/");
    let daysPerMonth = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let currMonth;
    for (let i in dateArr) {
        if (i < 2) {
            if (!(dateArr[i].length == 2))
                throwError(`Invalid date format '${date || 'provided'}'. '${variable}' expected format: 'mm/dd/yyyy'.`, BAD_REQUEST);
            if (i == 0) {
                //month
                if (!(months.includes(dateArr[i])))
                    throwError(`Invalid month passed in date '${date || 'provided'}'. '${variable}' expected format: 'mm/dd/yyyy'.`, BAD_REQUEST);
                currMonth = parseInt(dateArr[i]);
            } else { //day
                if ((parseInt(dateArr[i])) > (parseInt(daysPerMonth[currMonth - 1])))
                    throwError(`Invalid day passed in date '${date || 'provided'}'. '${variable}' expected format: 'mm/dd/yyyy'.`, BAD_REQUEST);
            }
        } else { //year
            if (!(dateArr[i].length == 4) || (dateArr[i] < 1000) || (dateArr[i] > 2024))
                throwError(`Invalid year passed in date '${date || 'provided'}'. '${variable}' expected format: 'mm/dd/yyyy'.`, BAD_REQUEST);
        }
    }
    let currDate = Date.now();

    if ((new Date(date)) > currDate)
        throwError(`Invalid date '${date || 'provided'}'.It should be before or equal to today's date.`, BAD_REQUEST);
    return date;
};


let checkisValidPublicationDate = (publicationDate, dateOfBirth) => {
    if ((new Date(publicationDate)) < (new Date(dateOfBirth)))
        throwError(`Publication date of a book cannot be before Author's date of birth.`, BAD_REQUEST);
}


let checkisValidPublication = (publicationDate, establishedYear) => {
    let year = new Date(publicationDate).getFullYear();
    if (year < establishedYear)
        throwError(`Publication date of a book cannot be before publisher's established year.`, BAD_REQUEST);
}
const deleteChaptersByBookId = async (chapters, bookId) => {
    const chapter = await chapterCollection();
    //delete existing chapters of that book 
    if (chapters) {
        const chaptersByBookId = await chapter.find({ bookId: bookId }).project({ _id: 1 }).toArray();
        if (chaptersByBookId) {
            for (let i = 0; i < chaptersByBookId.length; i++) {
                await deleteFromCache('chapter:{' + chaptersByBookId[i] + '}');
            }
            const deleteChaptersByBookId = await chapter.deleteMany({ bookId: bookId });
            if (!deleteChaptersByBookId) {
                throwError(`Could not delete chapters for book with _id of ${bookId}`, NOT_FOUND);
            }
            await deleteFromCache('chapters:{' + bookId + '}');
        }
    }
}

const checkisValidLocation = (str, variable) => {
    str = checkisValidString(str, variable);
    if (!(locationPattern.test(str)))
        throwError(`Input '${variable || 'provided'}' of value '${str || 'provided variable'}' is invalid.Expected pattern "city, State". For example: "Hoboken, New Jersey".`, BAD_REQUEST);
    return str;
}

const updateAuthor = async (authorId, authorData) => {
    const author = await authorCollection();
    delete authorData._id;
    const updatedAuthor = await author.findOneAndReplace(
        { _id: ObjectId.createFromHexString(authorId) },
        authorData,
        { returnDocument: 'after' });
    return updatedAuthor;
}

const updatePublisher = async (publisherId, publisherData) => {
    const publisher = await publisherCollection();
    delete publisherData._id;
    const updatedPublisher = await publisher.findOneAndReplace(
        { _id: ObjectId.createFromHexString(publisherId) },
        publisherData,
        { returnDocument: 'after' });
    return updatedPublisher;
}

const updateBook = async (bookId, bookData) => {
    const book = await bookCollection();
    delete bookData._id;
    const updatedBook = await book.findOneAndReplace(
        { _id: ObjectId.createFromHexString(bookId) },
        bookData,
        { returnDocument: 'after' });
    return updatedBook;
}

const removeIdFromArray = (ObjArray, removeId) => {
    let newObjArray = [];
    for (const i in ObjArray) {
        if (ObjArray[i] !== removeId) {
            newObjArray.push(new ObjectId(ObjArray[i]));
        }
    }
    return newObjArray;
}

const validateUniqueChapters = async (book, inputTitle) => {
    const chapter = await chapterCollection();
    for (const i in book.chapters) {
        let currChapter = await chapter.findOne({ _id: new ObjectId(book.chapters[i]) });
        if (currChapter && currChapter.title === inputTitle) {
            throwError(`Duplicate title passed in input. Titles within a book should be unique.`, BAD_REQUEST);
        }
    }
}

export {
    validateRange, ifExist, cacheData, throwError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, deleteFromCache, validateId, checkisValidDate,
    checkisValidName, checkisValidString, deleteChaptersByBookId, checkisValidLocation, updateAuthor, updatePublisher, removeIdFromArray, updateBook,
    checkisValidTitle, validateUniqueChapters, validateYear, clearCache, checkisValidPublicationDate, checkisValidPublication, deleteKeyMatches
}