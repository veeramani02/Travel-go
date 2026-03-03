import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import "../Styles/Dashboard.css";
import NavBar from "../Components/Navbar";

function DashboardLayout() {
  return (
    <div className="layout">

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="right-section">
        <NavBar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;

