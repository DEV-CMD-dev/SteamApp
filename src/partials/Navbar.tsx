import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
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

          <NavLink
              to="/"
              className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`}>STORE</NavLink>
          <NavLink
              to="/library"
              className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`}>LIBRARY</NavLink>

          {accessToken ? (
              <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`}>ACCOUNT</NavLink>
                ) : (
                <NavLink
                    to="/auth"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`}>LOGIN</NavLink>)}
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