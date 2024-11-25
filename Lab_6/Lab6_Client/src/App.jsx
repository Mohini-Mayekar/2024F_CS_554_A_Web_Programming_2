import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AuthorsList from './components/AuthorsList';
import AuthorDetail from './components/AuthorDetail';
// import PublishersList from './components/PublishersList';
// import PublisherDetail from './components/PublisherDetail';
// import BooksList from './components/BooksList';
// import BookDetail from './components/BookDetail';
// import NotFound from './components/NotFound';

function App() {

  return (
    <div className='App'>
      <header className='App-header'>
        <h1 className='App-title'>Library Management System</h1>
        <br />
        <br />
        <nav className='center'>
          <Link className='homeLink' to='/'>
            Home
          </Link>
          <Link className='link' to='/authors'>
            Authors
          </Link>
          <Link className='link' to='/publishers'>
            Publishers
          </Link>
          <Link className='link' to='/books'>
            Books
          </Link>
        </nav>
      </header>
      <br />
      <br />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/authors" element={<AuthorsList />} />
        <Route path="/authors/:id" element={<AuthorDetail />} />
        {/* <Route path="/publishers" element={<PublishersList />} />
        <Route path="/publishers/:id" element={<PublisherDetail />} />
        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/search" element={<Search />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  )
}

export default App
