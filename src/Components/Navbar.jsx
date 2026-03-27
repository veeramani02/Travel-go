import { useState, useEffect, useRef } from "react";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import TravelImage from "../assets/travel.png";
import UserImage from "../assets/user.png";
import "../Styles/NavBar.css";
import {  useNavigate } from "react-router-dom";
export default function NavBar() {
  const Navigate=useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3)

  const popupRef = useRef(null);
  const notifyRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        userRef.current &&
        !userRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        notifyRef.current &&
        !notifyRef.current.contains(e.target)
      ) {
        setIsNotifyOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={TravelImage} alt="logo" />
        <span>TravelGo</span>
      </div>

      <div className="nav-right">
        <div
          className="notification-wrapper"
          ref={notifyRef}
          onClick={() => setIsNotifyOpen(!isNotifyOpen)}
        >
          <FiBell className="icon" />
          {notificationCount > 0 && (
            <span className="badge">{notificationCount}</span>
          )}
          {isNotifyOpen && (
            <div className="dropdown">
              <p>New trip assigned</p>
              <p>Driver updated</p>
              <p>Trip completed</p>
            </div>
          )}
        </div>

        <div className="user-section">
          <img
            src={UserImage}
            alt="user"
            ref={userRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
            <div className="user-dropdown" ref={popupRef}>
              <span>John Doe</span>
              <button onClick={()=>Navigate("/login")} >Logout</button>
            </div>
          )}
        </div>

        <div
          className="mobile-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  );
}