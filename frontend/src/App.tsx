import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'

function Home() {
  return <h2>Главная страница</h2>;
}

function About() {
  return <h2>О нас</h2>;
}

function Contact() {
  return <h2>Контакты</h2>;
}

export default function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/about">О нас</Link>
          </li>
          <li>
            <Link to="/contact">Контакты</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}