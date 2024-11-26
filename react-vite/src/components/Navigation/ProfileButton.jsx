import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiMenuFries } from "react-icons/ci";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { IoMdClose } from "react-icons/io";
import SignupFormModal from "../SignupFormModal";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { getGreeting } from "../../HelperFunc/helperFuncs";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const toggledropDownCreate = (e) => {
    e.stopPropagation();
    setShowDropDown((prev) => !prev);
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
        {showMenu ? <IoMdClose className="hidden-x" style={{ color: '#00bfff', fontSize: '30px' }} /> : <CiMenuFries style={{ color: '#00bfff', fontSize: '30px' }} />}
      </button>
      <ul className={"profile-dropdown open"} ref={ulRef} style={{ display: showMenu ? 'block' : 'none', color: 'black' }}>
        <FaChevronRight onClick={toggleMenu} className="close-x slide-left" style={{ color: '#00bfff', fontSize: '20px' }} />

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'space-between', maxHeight: '500px'}}>

          <div style={{borderBottom: '1px solid rgba(255, 255, 255, 0.27)', marginBottom: '10px'}}>
            <li>{getGreeting()} {user ? user.username : 'Guest'}!</li>
          </div>

          <li>
            {user && <NavLink to={'/profile'}>
              My Profile
            </NavLink>}
          </li>
          <li>
            <NavLink to={'/decks'} className={location.pathname === '/decks' ? 'active' : ''}>
              Decks
            </NavLink>
          </li>
          <li>
            <NavLink to={'/events'} className={location.pathname === '/events' ? 'active' : ''}>
              Events
            </NavLink>
          </li>


          {user && (
            <>
              <li>
                <h4 id="sub-drop" onClick={toggledropDownCreate}>
                  {showDropDown ? <span>Create <FaChevronDown /></span> : <span>Create <FaChevronRight /></span>}
                </h4>
              </li>
              {showDropDown && (
                <>
                  <li>
                    <NavLink to={'/events/create'} className={'sub-nav'}>
                      Create Event
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={'/decks/create'} className={'sub-nav'}>
                      Create Deck
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}



          {user ? (
            <div>
            {user && <button style={{background: 'none',}} className="logout-btn" onClick={logout}>Log Out</button>}
          </div>
          ) : (
            <div className='sign-in-up' >
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
            </div>
          )}
        </div>

      </ul>

    </>
  );
}

export default ProfileButton;
