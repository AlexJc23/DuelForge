import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiMenuFries } from "react-icons/ci";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { IoMdClose } from "react-icons/io";
import SignupFormModal from "../SignupFormModal";
import { NavLink, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useLocation } from 'react-router-dom';

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false); // New state for nested menu
  const { closeModal } = useModal();

  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const location = useLocation();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const toggleSubmenu = (e) => {
    e.stopPropagation();
    setShowSubmenu((prev) => !prev);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowSubmenu(false); // Close submenu when main menu closes
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
    navigate('/');
    dispatch(thunkLogout());
    setShowMenu(false);
  };

  return (
    <>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={toggleMenu}
      >
        {showMenu ? <IoMdClose  className="hidden-x" style={{ color: '#00bfff', fontSize: '30px' }} /> : <CiMenuFries style={{ color: '#00bfff', fontSize: '30px' }} />}
      </button>
      <ul className={"profile-dropdown open"} ref={ulRef} style={{ display: showMenu ? 'block' : 'none', color: 'black' }}>
        <IoMdClose onClick={toggleMenu} className="close-x slide-left" style={{ color: '#00bfff', fontSize: '30px' }} />
        {user ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'space-between'}}>
            <div>
              <li>{user.username}</li>
              <li>{user.email}</li>
            </div>
            <li>
              <button
                style={{ background: 'none', border: 'none', color: '#00bfff', cursor: 'pointer' }}
                onClick={toggleSubmenu}
              >
                Go to...
              </button>
              {showSubmenu && (
                <ul style={{ marginLeft: '20px', marginTop: '10px', listStyle: 'none' }}>
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
                </ul>
              )}
            </li>
            <li>
              <button className="glow-on-hover2" onClick={logout}>Log Out</button>
            </li>
          </div>
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
