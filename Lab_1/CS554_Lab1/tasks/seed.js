import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { moviesData } from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();


for (let i = 1; i <= 150; i++) {
    let movieData = {
        title: `Movie${i}`,
        cast: [
            {
                firstName: "Leonardo",
                lastName: "DiCaprio"
            },
            {
                firstName: "Joseph",
                lastName: "Gordon Levitt"
            }
        ],
        info: {
            director: "Christopher Nolan",
            yearReleased: 2010
        },
        plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        rating: 4.8
    };

    const newMovie = await moviesData.createMovie(movieData.title, movieData.cast, movieData.info, movieData.plot, movieData.rating);
    const movieId = newMovie._id.toString();

    let comment1 = {
        name: "Joe One",
        comment: "Excellent!"
    };

    const newComment1 = await moviesData.addComment(movieId, comment1.name, comment1.comment);

    let comment2 = {
        name: "Joe Two",
        comment: "Good!"
    };
    const newComment2 = await moviesData.addComment(movieId, comment2.name, comment2.comment);

}


console.log('Done seeding database');

await closeConnection();