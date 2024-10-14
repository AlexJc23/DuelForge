import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const location = useLocation(); // Get current location

  // Check if the current path is either /decks or /events
  const showSearchBar = location.pathname === "/decks/" || location.pathname === "/events";

  return (
    <ul className="navbar">
      <li>
        <NavLink to="/">
          <img className='logo' src="/logo.svg" alt="duelforge logo" />
        </NavLink>
      </li>
      {/* Conditionally render the search bar based on the current path */}
      {showSearchBar && (
        <li className="searchbar">
          {/* Your search bar component or input goes here */}
          <input type="text" placeholder="Search..." />
        </li>
      )}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
