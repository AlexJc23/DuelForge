import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiMenuFries } from "react-icons/ci";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { IoMdClose } from "react-icons/io";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useLocation } from 'react-router-dom';

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { closeModal } = useModal();

  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const location = useLocation();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("click", closeMenu);
    }

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    setShowMenu(false);
  };

  return (
    <>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={toggleMenu}
      >
        {showMenu ? <IoMdClose style={{ color: '#00bfff', fontSize: '30px' }} /> : <CiMenuFries style={{ color: '#00bfff', fontSize: '30px' }} />}
      </button>
      <ul className={"profile-dropdown"} ref={ulRef} style={{ display: showMenu ? 'block' : 'none', color: 'black' }}>
        {user ? (
          <>
            <div>
              <li>{user.username}</li>
              <li>{user.email}</li>
            </div>
            <li>
              <NavLink to={'/decks'} className={location.pathname === '/decks' ? 'active' : ''}>
                All Decks
              </NavLink>
            </li>
            <li>
              <NavLink to={'/events'} className={location.pathname === '/events' ? 'active' : ''}>
                All Events
              </NavLink>
            </li>
            <li>
              <NavLink to={'/events/create'} className={location.pathname === '/events/create' ? 'active' : ''}>
                Create Event
              </NavLink>
            </li>
            <li>
              <NavLink to={'/decks/create'} className={location.pathname === '/decks/create' ? 'active' : ''}>
                Create Deck
              </NavLink>
            </li>
            <li>
              <button className="glow-on-hover2" onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={() => setShowMenu(false)}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
