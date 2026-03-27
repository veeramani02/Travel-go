import { useState, useEffect, useRef } from "react";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import TravelImage from "../assets/travel.png";
import UserImage from "../assets/user.png";
import "../Styles/NavBar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function NavBar() {
  const {setUser}=useAuth()
  const {user}=useAuth()
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const popupRef = useRef(null);
  const notifyRef = useRef(null);
  const userRef = useRef(null);

  //  LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // 🍪 important
      });

      // optional cleanup
      localStorage.removeItem("role");

      // redirect
      setUser(null)
      navigate("/login");
      // window.location.href="/login"
    } catch (error) {
      console.log(error);
    }
  };

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

      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
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
        {/* 🔔 Notifications */}
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

        {/* 👤 User */}
        <div className="user-section">
          <img
            src={UserImage}
            alt="user"
            ref={userRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          {isMenuOpen && (
            <div className="user-dropdown" ref={popupRef}>
              <span>{user?.name||"user"}</span>

              {/* 🔥 UPDATED LOGOUT */}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* 📱 Mobile */}
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