import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../css/navbar.css"

export default function Navbar() {
  const { accessToken } = useContext(AuthContext);

  return (
    <div className="navbar">
      <Link to='/'>Store</Link>
      <Link to='/library'>Library</Link>

      {accessToken ? (
        <Link to="/profile" className="navbar-button">
          Profile
        </Link>
      ) : (
        <Link to="/auth" className="navbar-button">
          Login
        </Link>
      )}
    </div>
  );
}
