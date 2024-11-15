import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Welcome to Explorer Hub!</h1>
            <h2>One stop for exploring events, attractions and venues across US.</h2>
            <p className='homePara'>
                Planning your next adventure or just looking for something exciting to do? You've come to the right place!
                <strong className='homeBold'> Explorer Hub</strong> is your ultimate destination for discovering a wide range of events, attractions,
                and venues across the United States. Whether you're a local looking for hidden gems or a traveler exploring
                new cities, our platform makes it easy to find activities that match your interests.
            </p>

            <h3>With Explorer Hub, you can:</h3>
            <ul>
                <li><strong className='homeBold'>Browse Events:</strong> Find concerts, sports games, festivals, and other live events happening near you.</li>
                <li><strong className='homeBold'>Discover Attractions:</strong> Explore popular attractions and unique spots, from historical landmarks to trendy hotspots.</li>
                <li><strong className='homeBold'>Visit Top Venues:</strong> Get information on renowned venues for unforgettable experiences.</li>
            </ul>

            <p className='homePara'>
                We’re here to help you make the most of every moment and create memories that last. Start exploring now and see what awaits you at
                <strong className='homeBold'> Explorer Hub</strong>!
            </p>
            {/* <nav className='center'>
                <Link className='link' to='/events/page/1'>
                    Events
                </Link>
                <Link className='link' to='/attractions/page/1'>
                    Attractions
                </Link>
                <Link className='link' to='/venues/page/1'>
                    Venues
                </Link>
            </nav> */}
        </div >
    );
}

export default Home;