import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Auth/Login";
import LandingPage from "./Pages/LandingPage";
import DashboardLayout from "./Layouts/DashboardLayout";
import Signup from './Pages/Auth/Signup'
import CustomerDashboard from "./Pages/Customer/CustomerDashboard";
import BookTrip from "./Pages/Customer/BookTrip";
import PaymentsHistory from "./Pages/Customer/PaymentsHistory";
import Payments from "./Pages/Customer/Payment";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import DriverDashboard from "./Pages/Driver/DriverDashboard";
import MyTrips from "./Pages/Customer/MyTrips";
import TrackTrip from "./Pages/Customer/TrackTrips";
import Prefrence from "./Pages/Customer/Prefrences";
import Rewards from "./Pages/Driver/Rewards";
import Salary from "./Pages/Driver/Salary";
import LoyaltyPoints from "./Pages/Customer/LoyaltyPoints";
import Dues from "./Pages/Customer/Dues";
import AssignedTrips from "./Pages/Driver/AssignedTrips"
import Enquiries from './Pages/Admin/Enquiries'
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        {/* Dashboard Layout Wrapper */}
        <Route element={<DashboardLayout />}>

          {/* Customer */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/book-trip" element={<BookTrip />} />
          <Route path="/customer/payment" element={<Payments/>}/>
          <Route path="/customer/paymentsHistory" element={<PaymentsHistory />} />
          <Route path="/customer/my-trips" element={<MyTrips />} />
          <Route path="/customer/track/:id" element={<TrackTrip />} />
          <Route path="/customer/prefrences" element={<Prefrence/>}/>
          <Route path="/customer/LoyaltyPoints" element={<LoyaltyPoints/>}/>
          <Route path="/customer/Dues" element={<Dues/>}/>
          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
          <Route path="/admin/enquiries" element={<Enquiries />} /> 


          {/* Driver */}
          <Route path="/driver/dashboard" element={<DriverDashboard />} /> 
            <Route path="/driver/salary" element={<Salary/>}/>
            <Route path="/driver/rewards" element={<Rewards/>}/>
            <Route path="/driver/trips" element={<AssignedTrips/>}/>
          </Route>
          
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
