import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./App.css";
import { PacmanLoader } from "react-spinners";

// Pages
import Login from "./Pages/Auth/Login";
import LandingPage from "./Pages/LandingPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import Signup from "./Pages/Auth/Signup";

// Customer
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import BookTrip from "./Pages/Customer/BookTrip";
import PaymentsHistory from "./Pages/Customer/PaymentsHistory";
import Payments from "./Pages/Customer/Payment";
import MyTrips from "./Pages/Customer/MyTrips";
import TrackTrip from "./Pages/Customer/TrackTrips";
// import Prefrence from "./Pages/Customer/Prefrences";
import Voucher from "./Pages/Customer/Voucher";
import LoyaltyPoints from "./Pages/Customer/LoyaltyPoints";
import Dues from "./Pages/Customer/Dues";

// Admin
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Enquiries from "./Pages/Admin/Enquiries";
import Vechiles from "./Pages/Admin/Vechiles";
import Driver from "./Pages/Admin/Driver";
import VehicleDetails from "./Pages/Admin/ViewVehicleDetails";
import Report from "./Pages/Admin/Report";
import Trips from "./Pages/Admin/Trips";
import Settings from "./Components/Settings";

// Driver
import DriverDashboard from "./Pages/Driver/DriverDashboard";
import Rewards from "./Pages/Driver/Rewards";
import Salary from "./Pages/Driver/Salary";
import AssignedTrips from "./Pages/Driver/AssignedTrips";

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="loading-container">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        {/*  Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />
          }
        />

        <Route path="/signup" element={<Signup />} />

        {/*  Protected Layout */}
        <Route element={<DashboardLayout />}>
          {/* Customer */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/book-trip"
            element={
              <ProtectedRoute role="customer">
                <BookTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/payment"
            element={
              <ProtectedRoute role="customer">
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/paymentsHistory"
            element={
              <ProtectedRoute role="customer">
                <PaymentsHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/my-trips"
            element={
              <ProtectedRoute role="customer">
                <MyTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/track/:id"
            element={
              <ProtectedRoute role="customer">
                <TrackTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/Vouchers"
            element={
              <ProtectedRoute role="customer">
                <Voucher />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/LoyaltyPoints"
            element={
              <ProtectedRoute role="customer">
                <LoyaltyPoints />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/Dues"
            element={
              <ProtectedRoute role="customer">
                <Dues />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/customer"
            element={
              <ProtectedRoute role="admin">
                <Enquiries />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/vehicles"
            element={
              <ProtectedRoute role="admin">
                <Vechiles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/Driver"
            element={
              <ProtectedRoute role="admin">
                <Driver />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicle-details"
            element={
              <ProtectedRoute role="admin">
                <VehicleDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/report"
            element={
              <ProtectedRoute role="admin">
                <Report />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/Trips"
            element={
              <ProtectedRoute role="admin">
                <Trips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="admin">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Driver */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute role="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/salary"
            element={
              <ProtectedRoute role="driver">
                <Salary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/rewards"
            element={
              <ProtectedRoute role="driver">
                <Rewards />
              </ProtectedRoute>
            }
          />

          <Route
            path="/driver/trips"
            element={
              <ProtectedRoute role="driver">
                <AssignedTrips />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
