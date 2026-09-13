import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import "../css/navbar.css";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";
import type { GameDto } from "../DTOs/Game/GameDto";
import { gameService } from "../services/gameService";

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [topSellers, setTopSellers] = useState<GameDto[]>([]);
  const [topSellersLoading, setTopSellersLoading] = useState(false);
  const [topSellersError, setTopSellersError] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDropdownClick = (category: string) => {
    const next = openDropdown === category ? null : category;

    setOpenDropdown(next);

    if (category === "Recommendations" && next === "Recommendations") {
      setTopSellersLoading(true);
      setTopSellersError(null);
    }
  };

  useEffect(() => {
    if (openDropdown !== "Recommendations") return;

    const loadTopSellers = async () => {
      try {
        setTopSellersLoading(true);
        setTopSellersError(null);

        const result = await gameService.getTopSellers(1, 3);

        setTopSellers(result.items);
      } catch (err) {
        setTopSellersError((err as Error).message || "Failed to load top sellers.");
      } finally {
        setTopSellersLoading(false);
      }
    };

    loadTopSellers();
  }, [openDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="categories-container" ref={categoriesRef}>
          <div className="categories-buttons-row">
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
              <img
                src={arrowDownIcon}
                alt="v"
                className={`dropdown-icon ${openDropdown === "Recommendations" ? "dropdown-icon-open" : ""}`} />
            </button>
          </div>

          {openDropdown === "Recommendations" && (
            <div className="recommendations-dropdown">
              <span className="recommendations-dropdown-title">Top Sellers</span>

              {topSellersLoading && (
                <div className="recommendations-dropdown-message">Loading...</div>
              )}

              {!topSellersLoading && topSellersError && (
                <div className="recommendations-dropdown-message">{topSellersError}</div>
              )}

              {!topSellersLoading && !topSellersError && topSellers.map(game => {
                const hasDiscount = game.discount > 0;
                const finalPrice = hasDiscount
                  ? (game.price * (1 - game.discount / 100)).toFixed(2)
                  : game.price.toFixed(2);

                return (
                  <Link
                    key={game.id}
                    to={`/game/${game.id}`}
                    className="recommendations-dropdown-item"
                    onClick={() => setOpenDropdown(null)}>
                    <img
                      src={game.coverImageHorizontal}
                      alt={game.title || "Game cover"}
                      className="recommendations-dropdown-image" />

                    <div className="recommendations-dropdown-info">
                      <span className="recommendations-dropdown-name">{game.title}</span>

                      <div className="recommendations-dropdown-pricing">
                        {hasDiscount && (
                          <span className="recommendations-discount-badge">-{game.discount}%</span>
                        )}

                        <div className="recommendations-price-block">
                          {hasDiscount && (
                            <span className="recommendations-original-price">${game.price.toFixed(2)}</span>
                          )}

                          <span className="recommendations-final-price">
                            {game.price === 0 ? "Free" : `$${finalPrice}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="nav-actions-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-bar-container">
              <input
                className="search-bar"
                type="text"
                placeholder="Search for games" />
              <button type="submit" className="search-bar-button">
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
          </form>

          <Link to="/wishlist" className="wishlist-container" style={accessToken ? {} : { display: "none" }}>
            <img src={starIcon} alt="Wishlist star" className="wishlist-icon" />
            <span className="wishlist-text">Wishlist</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}
