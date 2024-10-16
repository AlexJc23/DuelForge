import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import ProfileButton from "./ProfileButton";
import { useState } from 'react';
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const showSearchBar = location.pathname === "/decks" || location.pathname === "/events";

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to /decks with query params
    navigate(`/decks?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <ul className="navbar">
      <li>
        <NavLink to="/">
          <img className='logo' src="/logo.svg" alt="duelforge logo" />
        </NavLink>
      </li>

      {showSearchBar && (
        <li className="searchbar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search decks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
  
          </form>
        </li>
      )}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
