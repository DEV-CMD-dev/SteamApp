import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/navbar.css";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";
import SearchItem from "../components/Navbar/SearchItem";
import type { GameDto } from "../DTOs/Game/GameDto";

export default function Navbar() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<GameDto[]>([]);
  const [popularGames, setPopularGames] = useState<GameDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  async function GetSearchResults() {
    try {
      const response = await fetch(`https://localhost:7166/api/Games?SearchTerm=${searchTerm}&pageSize=4`);
      const data = await response.json();
      console.log(data.items);
      setSearchResults(data.items);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  }
  async function GetPopularGames() {
    try {
      const response = await fetch(`https://localhost:7166/api/Games?OnSaleOnly=true&pageNumber=1&pageSize=4`);
      const data = await response.json();
      console.log(data.items);
      setPopularGames(data.items);
    } catch (error) {
      console.error("Error fetching popular games:", error);
      setPopularGames([]);
    }
  }
  useEffect(() => {
    if (searchTerm.trim() === "") {
      return;
    }
    if (searchTerm.length < 3) {
      return;
    }
    GetSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    GetPopularGames();
  }, []);

  const handleDropdownClick = (category: string) => {
    console.log(`${category} dropdown clicked`);
  };

  return (
    <>
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
        </div>
      </nav>
      <div className="navbar-search-container-main">
        <div className="navbar-search-container">
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
                  placeholder="Search for games"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <button onClick={() => {
                  setSearchTerm("");
                  navigate("/search");
                  setIsFocused(false);
                }} type="submit" className="search-bar-button">
                  <img src={searchIcon} alt="Search" />
                </button>
                {
                  isFocused && (
                    <div className="nav-search-container" onMouseDown={(e) => e.preventDefault()}>
                      <p>{searchTerm.length >= 3 ? `Search results for "${searchTerm}"` : "Popular Searches"}</p>
                      {searchTerm.length < 3 ? (
                        popularGames?.map((game, index) => (
                          <SearchItem onClick={() => {
                            setSearchTerm("");
                            navigate(`/game/${game.id}`);
                            setIsFocused(false);
                          }} key={index} game={game} />
                        ))
                      ) : (
                        searchResults?.map((game, index) => (
                          <SearchItem onClick={() => {
                            setSearchTerm("");
                            navigate(`/game/${game.id}`);
                            setIsFocused(false);
                          }} key={index} game={game} />
                        )))}
                      <button onClick={() => {
                        setSearchTerm("");
                        navigate("/search");
                        setIsFocused(false);
                      }} type="button" className="advanced-search-button">
                        Advanced Search
                      </button>
                    </div>
                  )
                }
              </div>
            </form>

            <Link to="/wishlist" className="wishlist-container" style={accessToken ? {} : { display: "none" }}>
              <img src={starIcon} alt="Wishlist star" className="wishlist-icon" />
              <span className="wishlist-text">Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}