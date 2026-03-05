import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiMap, FiClock, FiCreditCard, FiSettings, FiUsers, FiTruck, FiDollarSign, FiAward, FiMenu,FiCalendar } from "react-icons/fi";
import "../Styles/Sidebar.css";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const role = localStorage.getItem("role") || "customer";

  // Mapping icons to names to keep the menu clean
  const icons = {
    Dashboard: <FiHome />,
    Enquiries: <FiUsers />,
    Trips: <FiMap />,
    "Assigned Trips": <FiMap />,
    Drivers: <FiUsers />,
    Vehicles: <FiTruck />,
    "Book Trip": <FiMap />,
    "My Trips": <FiClock />,
    Payments: <FiCreditCard />,
    Prefrence: <FiSettings />,
    Salary: <FiDollarSign />,
    Rewards: <FiAward />,
    dues:<FiCalendar/>
   
  };

  const menu = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Enquiries", path: "/admin/enquiries" },
      { name: "Trips", path: "/admin/trips" },
      { name: "Drivers", path: "/admin/driver" },
      { name: "Vehicles", path: "/admin/vehicles" },
    ],
    customer: [
      { name: "Dashboard", path: "/customer/dashboard" },
      { name: "Book Trip", path: "/customer/book-trip" },
      { name: "My Trips", path: "/customer/my-trips" },
      { name: "Payments", path: "/customer/paymentsHistory" },
      { name: "Prefrence", path: "/customer/prefrences" },
      { name: "Rewards", path:"/customer/LoyaltyPoints"},
      { name: "dues", path:"/customer/Dues"}
    ],
    driver: [
      { name: "Dashboard", path: "/driver/dashboard" },
      { name: "Assigned Trips", path: "/driver/trips" },
      { name: "Salary", path: "/driver/salary" },
      { name: "Rewards", path: "/driver/rewards" },
    ],
  };

  const currentMenu = menu[role] || [];

  return (
    <div 
      className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onClick={() => window.innerWidth <= 768 && setIsExpanded(!isExpanded)}
    >
      <ul className="menu">
        {currentMenu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")}
              onClick={() => setIsExpanded(false)} // Collapse after clicking a link
            >
              <span className="menu-icon">{icons[item.name] || <FiMenu />}</span>
              <span className="menu-text">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;