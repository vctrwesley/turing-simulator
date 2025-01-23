import { Link } from 'react-router-dom';
import { useState } from 'react';
import './navbar.css';

const Navbar = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Turing Machine</h1>
      <div className="menu">
          <a className="nav-item">
            <Link to="/" className="nav-link">Inicio</Link>
          </a>
          <a className="nav-item">
            <Link to="/about" className="nav-link">Sobre</Link>
          </a>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
          </button>
      </div>
    </nav>
  );
};

export default Navbar;
