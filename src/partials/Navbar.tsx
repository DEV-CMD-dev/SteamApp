import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import CategoriesDropdown from "./dropdowns/CategoriesDropdown";
import BrowseDropdown from "./dropdowns/BrowseDropdown";
import RecommendationsDropdown from "./dropdowns/RecommendationsDropdown";
import type { PanelStyle } from "./dropdowns/NavDropdownPanel";
import "../css/navbar.css";
import starIcon from "../assets/navbar/star.png";
import cartIcon from "../assets/navbar/cart.svg";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";
import SearchBar from "../components/Navbar/SearchBar";
import header_burger from "../assets/navbar/header_menu_hamburger.png";
import { orderService } from "../services/navbarService";
import type { MiniProfileDto } from "../DTOs/Profile/MiniProfileDto";
import arrowUpIcon from "../assets/navbar/arrow-up.svg";

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);
  const [profileOpen, setprofileOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState(0);
  const [cart, setCart] = useState(0);
  const [profile, setprofile] = useState<MiniProfileDto>();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [panelStyle, setPanelStyle] = useState<PanelStyle | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const navActionsContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function GetBalance() {
    try {
      const data = await orderService.getBalance();
      setBalance(data);
    } catch (error) {
      console.error(error);
      setBalance(0);
    }
  }
  async function GetUser() {
    try {
      const data = await orderService.getUser();
      setprofile(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function GetNumberOfCarts() {
    try {
      const data = await orderService.getNumberofCart();
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (accessToken) {
      GetBalance();
      GetUser();
      GetNumberOfCarts();
    }
  }, [accessToken]);

  const handleDropdownClick = (category: string) => {
    setActiveDropdown((prev) => (prev === category ? null : category));
  };

  const closeDropdown = () => setActiveDropdown(null);

  const handleViewAllTags = () => {
    setActiveDropdown(null);

    const carousel = document.getElementById("category-carousel");
    if (carousel) {
      carousel.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#category-carousel";
    }
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
  }, [activeDropdown]);

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
    <>
      <nav className="navbar">
        <div
          className={`mobile-overlay-nav ${profileOpen ? "open" : ""}`}
          onClick={() => setprofileOpen(false)}
        ></div>
        <div className={`mobile-profile-container ${profileOpen ? "open" : ""}`}>
          {accessToken ? (
            <div className="profile-container" style={{ background: `${profile?.avatar}` }}>
              <div className="profile-background">
                <div className="pfp-container">
                  <img className="profile-picture" src={profile?.avatar ?? 'https://www.pfpgeeks.com/static/images/black-pfp/webp/black-pfp-5.webp'} alt="" />
                  <div className="profile-description">
                    <p>{profile?.name}</p>
                    <div onClick={() => { setprofileOpen(false); navigate("/profile"); }} className="playerProfile_area_profilebtn">
                      <a className="profile-wiewv">View your profile</a>
                    </div>

                  </div>
                </div>
                <div className="profile-wallet-cart">
                  <a href="#" className="cart-link">Cart ({cart})</a>
                  <a href="#" className="wallet-link">Wallet ({balance}$)</a>
                </div>
              </div>
            </div>
          ) : (
            <div onClick={() => navigate("/auth")} className={`menu-item ${isStoreOpen ? "active" : ""}`}>
              <p>Sign in</p>
            </div>
          )}

          <div className="buttons-containers">
            <div onClick={() => setIsStoreOpen(prev => !prev)} className={`menu-item ${isStoreOpen ? "active" : ""}`}>
              <p>Store</p>
              <img src={arrowDownIcon} alt="v" className={`dropdown-icon_pfp ${isStoreOpen ? "open" : ""}`} />
            </div>
            <div className="store-container" style={{ height: `${isStoreOpen ? "108px" : "0px"}` }}>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/");
              }} className="store-btn">Home</button>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/wishlist");
              }} className="store-btn">Wishlist</button>
              <button className="store-btn">News</button>
            </div>
            <div onClick={() => setIsFriendsOpen(prev => !prev)} className={`menu-item ${isFriendsOpen ? "active" : ""}`}>
              <p>You & Friends</p>
              <img src={arrowDownIcon} alt="v" className={`dropdown-icon_pfp ${isFriendsOpen ? "open" : ""}`} />
            </div>
            <div className="store-container" style={{ height: `${isFriendsOpen ? "180px" : "0px"}` }}>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/profile");
              }} className="store-btn">Profile</button>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/friends");
              }} className="store-btn">Friends</button>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/library");
              }} className="store-btn">Games</button>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/badges");
              }} className="store-btn">Badges</button>
              <button onClick={() => {
                setprofileOpen(false);
                navigate("/inventory");
              }} className="store-btn">Inventory</button>
            </div>

            <div className="footer-links-container">
              <a href="#">Account details</a>
              <a href="#">Store preferences</a>
              <a href="#">Change language</a>
              <a href="#">Change user</a>
              <a href="#">Get the Steam Mobile App</a>
              <a href="#">View desktop website</a>
            </div>

            <div className="valve-footer">
              <div className="valve-logo-text"><img className="logo-footer" src={logo}></img></div>
              <p>
                © Nexus Corporation. All rights reserved. All trademarks are property of their respective owners in the US and other countries. <a href="#">Privacy Policy</a> | <a href="#">Legal</a> | <a href="#">Accessibility</a> | <a href="#">Nexus Subscriber Agreement</a> | <a href="#">Refunds</a> | <a href="#">Cookies</a>
              </p>
            </div>
          </div>
        </div>
        <div className="navbar-container">
          <button onClick={() => setprofileOpen(prev => !prev)} className="burger-btn"></button>
          <div className="logo-container">
            <Link to="/" className="logo">
              <img src={logo} alt="Website Logo" className="logo-img" />
            </Link>
          </div>
          <div className="search-container">
            <SearchBar />
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
      {location.pathname !== "/library" && (
      <div className="navbar-search-container-main" style={{ background : `${activeDropdown ? '#182534' : ''}`}}>
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
          <div className="menu-div">
            <button
              type="button"
              className="category-dropdown-btn"
              onClick={() => handleDropdownClick("Browse")}>
              <span>Menu</span>
              <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
            </button>
          </div>

          <div className="nav-actions-container" ref={navActionsContainerRef}>
            <div className="main-search-container">
              <SearchBar />
            </div>
            <Link to="/wishlist" className="wishlist-container" style={accessToken ? {} : { display: "none" }}>
              <img src={starIcon} alt="Wishlist star" className="wishlist-icon" />
              <span className="wishlist-text">Wishlist</span>
            </Link>
            <Link to="/cart" className="cart-container" style={accessToken ? {} : { display: "none" }}>
              <img src={cartIcon} alt="Wishlist star" className="wishlist-icon" />
              <span className="wishlist-text">Cart</span>
            </Link>
          </div>
        </div>
        <div className="dropdowns-container">
          <BrowseDropdown
            isOpen={activeDropdown === "Browse"}
            panelStyle={panelStyle}
            onLinkClick={closeDropdown} />
          <CategoriesDropdown
            isOpen={activeDropdown === "Categories"}
            panelStyle={panelStyle}
            onNavigateToAllTags={handleViewAllTags}
            onLinkClick={closeDropdown} />
          <RecommendationsDropdown
            isOpen={activeDropdown === "Recommendations"}
            panelStyle={panelStyle}
            onLinkClick={closeDropdown} />
        </div>
      </div>
    )}
    </>
  );
}