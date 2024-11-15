import { dbConnection, closeConnection } from '../config/mongoConnection.js';

import {
    authors as authorCollection,
    books as bookCollection,
    publishers as publisherCollection
} from '../config/mongoCollections.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const authors = await authorCollection();
    const books = await bookCollection();
    const publishers = await publisherCollection();

    //Publishers
    await publishers.insertMany([
        {
            name: 'The New York Times',
            establishedYear: 1851,
            location: 'New York City, New York',
            books: []
        },
        {
            name: 'The Washington Post',
            establishedYear: 1877,
            location: 'Washington, D.C.',
            books: []
        },
        {
            name: 'The Guardian',
            establishedYear: 1821,
            location: 'London, England',
            books: []
        },
        {
            name: 'The Wall Street Journal',
            establishedYear: 1889,
            location: 'New York City, New York',
            books: []
        },
        {
            name: 'Los Angeles Times',
            establishedYear: 1881,
            location: 'Los Angeles, California',
            books: []
        },
        {
            name: 'Chicago Tribune',
            establishedYear: 1847,
            location: 'Chicago, Illinois',
            books: []
        },
        {
            name: 'The Times of India',
            establishedYear: 1838,
            location: 'Mumbai, Maharashtra',
            books: []
        },
        {
            name: 'Le Monde',
            establishedYear: 1944,
            location: 'Paris, France',
            books: []
        },
        {
            name: 'The Sydney Morning Herald',
            establishedYear: 1831,
            location: 'Sydney, New South Wales',
            books: []
        },
        {
            name: 'The Economist',
            establishedYear: 1843,
            location: 'London, England',
            books: []
        }
    ]);

    await authors.insertMany([
        {
            name: "George Orwell",
            bio: "George Orwell, born Eric Arthur Blair, was an English novelist, essayist, and critic. He is best known for his novels '1984' and 'Animal Farm.' His works explore issues of social injustice, totalitarianism, and the misuse of political power.",
            dateOfBirth: "06/25/1903",
            books: []
        },
        {
            name: "Virginia Woolf",
            bio: "Virginia Woolf was an English writer and one of the foremost modernists of the 20th century. She is best known for her novels 'Mrs Dalloway' and 'To the Lighthouse,' which explored the inner lives of her characters.",
            dateOfBirth: "01/25/1882",
            books: []
        },
        {
            name: "Salman Rushdie",
            bio: "Salman Rushdie is an Indian-British novelist and essayist known for his controversial and satirical works. His most famous novel, 'Midnight's Children,' won the Booker Prize. He is also known for 'The Satanic Verses,' which sparked international controversy.",
            dateOfBirth: "06/19/1947",
            books: []
        },
        {
            name: "Margaret Atwood",
            bio: "Margaret Atwood is a Canadian poet, novelist, and literary critic, best known for her dystopian novel 'The Handmaid's Tale,' which explores issues of gender, power, and oppression.",
            dateOfBirth: "11/18/1939",
            books: []
        },
        {
            name: "Chimamanda Ngozi Adichie",
            bio: "Chimamanda Ngozi Adichie is a Nigerian writer known for her novels 'Half of a Yellow Sun' and 'Americanah,' which explore themes of identity, migration, and the effects of war.",
            dateOfBirth: "09/15/1977",
            books: []
        },
        {
            name: "J.K. Rowling",
            bio: "J.K. Rowling is a British author best known for writing the 'Harry Potter' series, which became a global phenomenon. Her work explores themes of friendship, courage, and the fight between good and evil.",
            dateOfBirth: "07/31/1965",
            books: []
        },
        {
            name: "Ernest Hemingway",
            bio: "Ernest Hemingway was an American novelist, short-story writer, and journalist. Known for his sparse writing style, he wrote classics such as 'The Old Man and the Sea' and 'A Farewell to Arms.' He won the Nobel Prize in Literature in 1954.",
            dateOfBirth: "07/21/1899",
            books: []
        },
        {
            name: "Toni Morrison",
            bio: "Toni Morrison was an American novelist and essayist. Her novels, including 'Beloved' and 'The Bluest Eye,' explored African American experiences, particularly those of women, and the impact of slavery and racism.",
            dateOfBirth: "02/18/1931",
            books: []
        },
        {
            name: "Gabriel García Márquez",
            bio: "Gabriel García Márquez was a Colombian novelist and short-story writer, best known for his novel 'One Hundred Years of Solitude,' a masterpiece of magical realism. He won the Nobel Prize in Literature in 1982.",
            dateOfBirth: "03/06/1927",
            books: []
        },
        {
            name: "F. Scott Fitzgerald",
            bio: "F. Scott Fitzgerald was an American novelist and short-story writer, widely regarded as one of the greatest American writers of the 20th century. He is best known for 'The Great Gatsby,' a critique of the American Dream.",
            dateOfBirth: "09/24/1896",
            books: []
        },
        {
            name: "Zadie Smith",
            bio: "Zadie Smith is a British novelist, essayist, and short-story writer, best known for her novel 'White Teeth,' which explores themes of cultural identity, migration, and family dynamics in multicultural London.",
            dateOfBirth: "10/25/1975",
            books: []
        },
        {
            name: "Haruki Murakami",
            bio: "Haruki Murakami is a Japanese novelist and translator known for his surrealistic and often melancholic works. His most popular novels include 'Norwegian Wood' and 'Kafka on the Shore.'",
            dateOfBirth: "01/12/1949",
            books: []
        },
        {
            name: "James Baldwin",
            bio: "James Baldwin was an American novelist, essayist, and social critic. His works, such as 'Go Tell It on the Mountain' and 'Giovanni's Room,' explore themes of race, sexuality, and identity.",
            dateOfBirth: "08/02/1924",
            books: []
        },
        {
            name: "Isabel Allende",
            bio: "Isabel Allende is a Chilean-American writer whose works often contain elements of magical realism. She is best known for her novel 'The House of the Spirits,' which chronicles the struggles of a South American family over several generations.",
            dateOfBirth: "08/02/1942",
            books: []
        },
        {
            name: "Kurt Vonnegut",
            bio: "Kurt Vonnegut was an American writer known for his satirical and darkly humorous novels. His most famous work, 'Slaughterhouse-Five,' explores the horrors of war and the absurdity of life.",
            dateOfBirth: "11/11/1922",
            books: []
        },
        {
            name: "Jhumpa Lahiri",
            bio: "Jhumpa Lahiri is an American author of Indian descent. She is best known for her Pulitzer Prize-winning short story collection 'Interpreter of Maladies,' which explores the experiences of Indian immigrants in the United States.",
            dateOfBirth: "07/11/1967",
            books: []
        },
        {
            name: "Alice Walker",
            bio: "Alice Walker is an American novelist, poet, and social activist, best known for her novel 'The Color Purple,' which won the Pulitzer Prize and explores themes of racism, sexism, and oppression.",
            dateOfBirth: "02/09/1944",
            books: []
        },
        {
            name: "Kazuo Ishiguro",
            bio: "Kazuo Ishiguro is a British novelist of Japanese descent. He is best known for his novels 'Never Let Me Go' and 'The Remains of the Day,' which explore themes of memory, loss, and identity.",
            dateOfBirth: "11/08/1954",
            books: []
        },
        {
            name: "Maya Angelou",
            bio: "Maya Angelou was an American poet, memoirist, and civil rights activist. She is best known for her series of autobiographies, including 'I Know Why the Caged Bird Sings,' which details her early life and struggles with racism and trauma.",
            dateOfBirth: "04/04/1928",
            books: []
        },
        {
            name: "Michael Chabon",
            bio: "Michael Chabon is an American novelist and short-story writer, known for his novel 'The Amazing Adventures of Kavalier & Clay,' which won the Pulitzer Prize and explores themes of Jewish identity and the comic book industry.",
            dateOfBirth: "05/24/1963",
            books: []
        }
    ]);

    console.log('Done seeding database');
    await closeConnection();
};

main().catch(console.log);