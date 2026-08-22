import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import "../css/navbar.css";
import type { TagDto } from "../DTOs/Tag/TagDto";
import { tagService } from "../services/tagService";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [tags, setTags] = useState<TagDto[]>([]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (!isCategoriesOpen || tags.length > 0) {
      return;
    }

    tagService.getAll(1, 6)
      .then((result) => setTags(result.items))
      .catch((error) => console.error("Failed to load navbar categories.", error));
  }, [isCategoriesOpen, tags.length]);

  const handleDropdownClick = (category: string) => {
    if (category === "Categories") {
      setIsCategoriesOpen((isOpen) => !isOpen);
    }
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
            className={`category-dropdown-btn ${isCategoriesOpen ? "open" : ""}`}
            aria-expanded={isCategoriesOpen}
            aria-controls="navbar-categories-list"
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

        {isCategoriesOpen && (
          <div className="navbar-categories-list" id="navbar-categories-list">
            <div className="navbar-categories-heading">
              <span>YOUR TOP CATEGORIES</span>
              <Link to="/" className="view-all-tags">View all tags <span aria-hidden="true">›</span></Link>
            </div>
            <div className="navbar-category-cards">
              {tags.map((tag) => (
                <Link to={`/?tagId=${tag.id}`} className="navbar-category-card" key={tag.id}>
                  {tag.picture && <img src={tag.picture} alt="" />}
                  <span>{tag.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

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