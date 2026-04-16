import { useState, useEffect, useRef } from "react";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import TravelImage from "../assets/travel.png";
import UserImage from "../assets/user.png";
import "../Styles/NavBar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getAvatarColor } from "../services/customerService";

export default function NavBar() {
  const { setUser, user } = useAuth();
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
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }

      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setIsNotifyOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={TravelImage} alt="logo" />
        <span>TravelGo</span>
      </div>

      <div className="nav-right">
        {/* Notifications */}
        <div
          className="notification-wrapper"
          ref={notifyRef}
          onClick={(e) => {
            setIsNotifyOpen((prev) => !prev);
            e.stopPropagation();
          }}
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

        {/*  User */}
        <div className="user-section">
          {user?.profile ? (
            <img
              src={user?.profile}
              ref={userRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((p) => !p);
              }}
            />
          ) : (
            <div
              className="user-image-no-div"
              style={{ background: getAvatarColor(user?.name) }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((p) => !p);
              }}
            >
              <span>
                {user?.name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2) || "U"}
              </span>
            </div>
          )}

          {isMenuOpen && (
            <div className="user-dropdown" ref={popupRef}>
              <span className="user-name">{user?.name || "user"}</span>
              <p className="user-role">{user?.role?.toUpperCase() || "USER"}</p>
              <p className="user-email">{user?.email || "No email"}</p>
              <hr />
              <p
                className="dropdown-item"
                onClick={() => navigate(`/${user?.role}/dashboard`)}
              >
                Dashboard
              </p>
              <p
                className="dropdown-item"
                onClick={() => navigate(`/${user?.role}/settings`)}
              >
                Settings
              </p>
              {/*   LOGOUT */}
              <hr />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/*  Mobile */}
        <div
          className="mobile-toggle"
          onClick={() => setIsMobileOpen((p) => !p)}
        >
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  );
}
