import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import ProfileButton from "./ProfileButton";
import { useState } from 'react';
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const showSearchBar = location.pathname === "/decks" || location.pathname === "/events";
  let path;

  if(location.pathname === '/decks') {
    path = `/decks?search=${encodeURIComponent(searchTerm)}`
  } else if ( location.pathname === '/events' ){
    path = `/events?search=${encodeURIComponent(searchTerm)}`
  }

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to /decks with query params
    navigate(path);
    setSearchTerm("")
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
              type="textarea"
              placeholder="Search..."
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
