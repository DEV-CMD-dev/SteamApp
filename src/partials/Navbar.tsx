import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import type { TagDto } from "../DTOs/Tag/TagDto";
import { tagService } from "../services/tagService";
import Tag from "../components/Store/Tag";
import "../css/navbar.css";

import searchIcon from "../assets/navbar/search.png";
import starIcon from "../assets/navbar/star.png";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";
import arrowUpIcon from "../assets/navbar/arrow-up.svg";

const TOP_CATEGORIES_COUNT = 6;
const DROPDOWN_ANIMATION_DURATION = 280;

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<TagDto[]>([]);
  const [panelStyle, setPanelStyle] = useState<{ marginLeft: number; width: number } | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const navActionsContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDropdownClick = async (category: string) => {
    setActiveDropdown((prev) => (prev === category ? null : category));

    if (category === "Categories" && categories.length === 0) {
      try {
        const tags = await tagService.getAll(1, TOP_CATEGORIES_COUNT);
        setCategories(tags.items);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleViewAllTags = () => {
    setActiveDropdown(null);

    const scrollToCarousel = () => {
      const carousel = document.getElementById("category-carousel");

      if (carousel) {
        const elementPosition = carousel.getBoundingClientRect().top + window.scrollY;

        const navbarHeight = navRef.current?.offsetHeight || 0;
        window.scrollTo({
          top: elementPosition - navbarHeight - 20,
          behavior: "smooth",
        });
      } else {
        window.location.href = "/#category-carousel";
      }
    };
    requestAnimationFrame(() => {
      setTimeout(scrollToCarousel, DROPDOWN_ANIMATION_DURATION);
    });
  };

  const recalculatePanelPosition = () => {
    if (!navRef.current || !categoriesContainerRef.current || !navActionsContainerRef.current) {
      return;
    }

    const navRect = navRef.current.getBoundingClientRect();
    const startRect = categoriesContainerRef.current.getBoundingClientRect();
    const endRect = navActionsContainerRef.current.getBoundingClientRect();

    setPanelStyle({
      marginLeft: startRect.left - navRect.left,
      width: endRect.right - startRect.left,
    });
  };

  useLayoutEffect(() => {
    recalculatePanelPosition();
    window.addEventListener("resize", recalculatePanelPosition);
    return () => window.removeEventListener("resize", recalculatePanelPosition);
  }, [activeDropdown, categories]);

  // Публікуємо реальну висоту навбару в CSS-змінну для розрахунку відступів сторінки
  useLayoutEffect(() => {
    if (!navRef.current) {
      return;
    }

    const updateHeight = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navRef.current.offsetHeight}px`
        );
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`navbar ${activeDropdown === "Categories" ? "navbar-expanded" : ""}`}
      ref={navRef}
    >
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
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            STORE
          </NavLink>

          <NavLink
            to="/library"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            LIBRARY
          </NavLink>

          {accessToken ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              ACCOUNT
            </NavLink>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              LOGIN
            </NavLink>
          )}
        </div>

        <div
          className="categories-container"
          ref={categoriesContainerRef}
        >
          <button
            type="button"
            className="category-dropdown-btn"
            onClick={() => handleDropdownClick("Browse")}
          >
            <span>Browse</span>
            <img
              src={
                activeDropdown === "Browse"
                  ? arrowUpIcon
                  : arrowDownIcon
              }
              alt="v"
              className="dropdown-icon"
            />
          </button>

          <button
            type="button"
            className="category-dropdown-btn"
            onClick={() => handleDropdownClick("Categories")}
          >
            <span>Categories</span>
            <img
              src={
                activeDropdown === "Categories"
                  ? arrowUpIcon
                  : arrowDownIcon
              }
              alt="v"
              className="dropdown-icon"
            />
          </button>

          <button
            type="button"
            className="category-dropdown-btn"
            onClick={() => handleDropdownClick("Recommendations")}
          >
            <span>Recommendations</span>
            <img
              src={
                activeDropdown === "Recommendations"
                  ? arrowUpIcon
                  : arrowDownIcon
              }
              alt="v"
              className="dropdown-icon"
            />
          </button>
        </div>

        <div
          className="nav-actions-container"
          ref={navActionsContainerRef}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="search-form"
          >
            <div className="search-bar-container">
              <input
                className="search-bar"
                type="text"
                placeholder="Search for games"
              />

              <button
                type="submit"
                className="search-bar-button"
              >
                <img src={searchIcon} alt="Search" />
              </button>
            </div>
          </form>

          <Link
            to="/wishlist"
            className="wishlist-container"
            style={
              accessToken ? {} : { display: "none" }
            }
          >
            <img
              src={starIcon}
              alt="Wishlist star"
              className="wishlist-icon"
            />

            <span className="wishlist-text">
              Wishlist
            </span>
          </Link>
        </div>
      </div>

      <div
        className={`categories-dropdown ${activeDropdown === "Categories" ? "open" : ""}`}
      >
        <div
          className="categories-dropdown-inner"
          style={
            panelStyle
              ? { marginLeft: panelStyle.marginLeft, width: panelStyle.width }
              : undefined
          }
        >
          <div className="categories-dropdown-content">
            <span className="categories-dropdown-title">
              YOUR TOP CATEGORIES
            </span>

            <div className="categories-dropdown-grid">
              {categories.slice(0, TOP_CATEGORIES_COUNT).map((tag) => (
                <div className="categories-dropdown-item" key={tag.id}>
                  <Tag {...tag} />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="categories-dropdown-view-all"
              onClick={handleViewAllTags}
            >
              View all tags &gt;
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}