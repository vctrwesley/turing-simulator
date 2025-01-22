import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
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
      </div>
    </nav>
  );
};

export default Navbar;
