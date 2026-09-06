import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import "../css/navbar.css";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg"; 

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!recommendationsRef.current?.contains(e.target as Node)) {
        setIsRecommendationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          <div className="dropdown-wrapper" ref={recommendationsRef}>
            <button
              type="button"
              className="category-dropdown-btn"
              onClick={() => setIsRecommendationsOpen(prev => !prev)}>
              <span>Recommendations</span>
              <img
                src={arrowDownIcon}
                alt="v"
                className={`dropdown-icon ${isRecommendationsOpen ? "open" : ""}`} />
            </button>

            {isRecommendationsOpen && (
              <div className="recommendations-panel">
                <div className="recommendations-content">
                  <div className="recommendations-menu">
                    <Link
                      to="/"
                      className="recommendations-menu-item"
                      onClick={() => setIsRecommendationsOpen(false)}>
                      <span className="recommendations-menu-title">Store Home</span>
                    </Link>

                    <div className="recommendations-menu-item">
                      <span className="recommendations-menu-title">New Releases</span>
                      <span className="recommendations-menu-subtitle">Explore new content on nexus</span>
                    </div>

                    <div className="recommendations-menu-item">
                      <span className="recommendations-menu-title">Upcoming Releases</span>
                      <span className="recommendations-menu-subtitle">See what's on the release calendar</span>
                    </div>

                    <div className="recommendations-menu-item">
                      <span className="recommendations-menu-title">All Charts &amp; Stats</span>
                      <span className="recommendations-menu-subtitle">Explore top titles by week, month, or year</span>
                    </div>
                  </div>

                  <div className="recommendations-banners">
                    <Link
                      to="/top-sellers"
                      className="recommendations-banner top-sellers-banner"
                      onClick={() => setIsRecommendationsOpen(false)}>
                      <span className="recommendations-banner-btn">TOP SELLERS</span>
                    </Link>

                    <div className="recommendations-banner discounts-banner">
                      <span className="recommendations-banner-btn">DISCOUNTS &amp; EVENTS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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