import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import "../css/navbar.css";
import starIcon from "../assets/navbar/star.png";
import cartIcon from "../assets/navbar/cart.svg";
import logo from "../assets/logo.svg";
import arrowDownIcon from "../assets/navbar/arrow-down.svg";
import SearchBar from "../components/Navbar/SearchBar";

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);
  const [profileOpen, setprofileOpen] = useState<boolean>(false);

  const handleDropdownClick = (category: string) => {
    console.log(`${category} dropdown clicked`);
  };

  return (
    <>
      <nav className="navbar">
        <div
          className={`mobile-overlay-nav ${profileOpen ? "open" : ""}`}
          onClick={() => setprofileOpen(false)}
        ></div>
        <div className={`mobile-profile-container ${profileOpen ? "open" : ""}`}>
          <div className="profile-container">
            <div className="profile-background">
              <div className="pfp-container">
                <img className="profile-picture" src="https://s0.tchkcdn.com/g-eUDvtxKEfeGLVZ6YE8am3w/17/258037/660x480/f/0/cd1_depositphotos_21510387_m_2015.jpg" alt="" />
                <div className="profile-description">
                  <p>ch1llboy</p>
                  <div className="playerProfile_area_profilebtn">
                    <a  className="profile-wiewv">View your profile</a>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="buttons-containers">
            <div className="menu-item">
              <p>Notifications</p>
              <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
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
          <div className="menu-div">
            <button
              type="button"
              className="category-dropdown-btn"
              onClick={() => handleDropdownClick("Browse")}>
              <span>Menu</span>
              <img src={arrowDownIcon} alt="v" className="dropdown-icon" />
            </button>
          </div>
          <div className="nav-actions-container">
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
      </div>
    </>
  );
}