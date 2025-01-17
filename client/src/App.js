import React, { useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

// Import your page components
import Home from "./pages/homepage/homepage.jsx"
import NavBar from "./pages/components/navbar/navbar"
import Login from "./pages/loginpage/loginpage.jsx";
import Account from "./pages/accountpage/accountpage.jsx";
import { AuthContext } from "./context/AuthContext";
import Register from "./pages/registerpage/registerpage.jsx";
import RegisterBike from "./pages/registerbikepage/registerbikepage.jsx";
import Rentals from "./pages/rentalpage/rentalPage.jsx"
import RouteChangeListener from "./context/idle.js";
import OwnedBike from "./pages/ownedbikepage/ownedBikePage.jsx";
import MapPage from "./pages/mappage/mapPage.jsx";
import Footer from "./pages/components/footer/footer.jsx";
import BikePage from "./pages/bikepage/bikepage.jsx";
import UpcomingPage from "./pages/upcomingpage/upcomingpage.jsx";
import UserRentalsPage from "./pages/userrentalspage/userrentalspage.jsx"
import RentalBikePage from "./pages/rentalbikepage/rentalbikepage.jsx"
import BookingPage from "./pages/bookingpage/bookingpage.jsx";
import PaymentPage from "./pages/paymentpage/paymentpage.jsx";
import CompletionPage from "./pages/completionpage/completionpage.jsx";
import OwnerPage from "./pages/ownerpage/ownerpage.jsx";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
     <RouteChangeListener/>
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/map" element={<MapPage />}/>
        <Route path="/bike/:id" element={<BikePage />}/>
        <Route path="/ownerpage/:id" element={<OwnerPage />} />
        <Route path="/booking" element ={user? <BookingPage /> : <Navigate to='login' replace />} />
        <Route path="/checkout" element ={user? <PaymentPage /> : <Navigate to='login' replace />} />
        <Route path="/completion" element ={user? <CompletionPage /> : <Navigate to='login' replace />} />
        <Route path="/registerbike" element={user ? <RegisterBike /> : <Navigate to="/login" replace />} />
        <Route path='/account' element={user ? <Account /> : <Navigate to="/login" replace />} />
        <Route path='/rentals' element={user ? <Rentals /> : <Navigate to="/login" replace />} />
        <Route path='/rental/:id' element={user ? <RentalBikePage /> :  <Navigate to="/login" replace />} />
        <Route path='/userrentals' element={user ? <UserRentalsPage /> : <Navigate to="/login" replace />} />
        <Route path='/upcomingrentals' element={user ? <UpcomingPage /> : <Navigate to="/login" replace />} />
        <Route path="/ownedbike/:id" element={user ? <OwnedBike />: <Navigate to="/login" replace />} />
        
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;