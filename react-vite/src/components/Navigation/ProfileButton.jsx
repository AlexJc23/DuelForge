import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiMenuFries } from "react-icons/ci";
import { thunkLogin, thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { IoMdClose } from "react-icons/io";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import { useModal } from "../../context/Modal";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const { closeModal } = useModal();

  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

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

  const handleDemo = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({ email: "demo@aa.io", password: "password" }))

      if (serverResponse) {
        setErrors(serverResponse);
      } else {
        closeModal()
      }
      closeModal()
    }

  return (
    <>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        onClick={toggleMenu}
      >
        {showMenu ? <IoMdClose style={{ color: '#00bfff', fontSize: '30px' }} /> : <CiMenuFries style={{ color: '#00bfff', fontSize: '30px' }} />}
      </button>
      <ul className={"profile-dropdown"} ref={ulRef} style={{ display: showMenu ? 'block' : 'none' }}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li><NavLink style={{color: 'black'}} to={'/events/create'}>Create Event</NavLink></li>
            <li><NavLink style={{color: 'black'}} to={'/decks/create'}>Create Deck</NavLink></li>
            <li>
              <button onClick={logout}>Log Out</button>
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
          <button onClick={handleDemo}>Demo Login</button>
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
