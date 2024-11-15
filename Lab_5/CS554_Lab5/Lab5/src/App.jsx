import { useState } from 'react'
import './App.css'

import Home from './components/Home';
import EventsList from './components/EventsList';
import EventDetail from './components/EventDetail';
import AttractionsList from './components/AttractionsList';
import AttractionDetail from './components/AttractionDetail';
import VenuesList from './components/VenuesList';
import VenueDetail from './components/VenueDetail';
import NotFound from './components/NotFound';

import { Link, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-title'>Explorer Hub</h1>
        <br />
        <br />
        <nav className='center'>
          <Link className='homeLink' to='/'>
            Home
          </Link>
          <Link className='link' to='/events/page/1'>
            Events
          </Link>
          <Link className='link' to='/attractions/page/1'>
            Attractions
          </Link>
          <Link className='link' to='/venues/page/1'>
            Venues
          </Link>
        </nav>
      </header>
      <br />
      <br />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/events/page/:page" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/attractions/page/:page" element={<AttractionsList />} />
        <Route path="/attractions/:id" element={<AttractionDetail />} />
        <Route path="/venues/page/:page" element={<VenuesList />} />
        <Route path="/venues/:id" element={<VenueDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
