import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../css/navbar.css";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg"; 

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDropdownClick = (category: string) => {
    console.log(`${category} dropdown clicked`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src={logo} alt="Website Logo" className="logo-img" />
          </Link>
        </div>

        <div className="nav-buttons-container">
          <Link to="/" className="nav-link">STORE</Link>
          <Link to="/library" className="nav-link">LIBRARY</Link>

          {accessToken ? (
            <Link to="/profile" className="nav-link">ACCOUNT</Link>
          ) : (
            <Link to="/auth" className="nav-link">LOGIN</Link>
          )}
        </div>

        <div className="categories-container">
          <button 
            type="button" 
            className="category-dropdown-btn" 
            onClick={() => handleDropdownClick("Browse")}>
            <span>Browse</span>
            <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
          </button>

          <button 
            type="button" 
            className="category-dropdown-btn" 
            onClick={() => handleDropdownClick("Categories")}>
            <span>Categories</span>
            <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
          </button>

          <button 
            type="button" 
            className="category-dropdown-btn" 
            onClick={() => handleDropdownClick("Recommendations")}>
            <span>Recommendations</span>
            <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
          </button>
        </div>

        <div className="nav-actions-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-bar-container">
              <input 
                className="search-bar" 
                type="text" 
                placeholder="Search for games"/>
              <button type="submit" className="search-bar-button">
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
          </form>

          <Link to="/wishlist" className="wishlist-container" style={accessToken ? {} : {display: "none"}}>
            <img src={starIcon} alt="Wishlist star" className="wishlist-icon" />
            <span className="wishlist-text">Wishlist</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}