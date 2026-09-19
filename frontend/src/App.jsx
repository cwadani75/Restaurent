import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Menu from './pages/Menu'
import FoodDetails from './pages/FoodDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Reservations from './pages/Reservations'
import About from './pages/About'
import Contact from './pages/Contact'
import Ordering from './pages/Ordering'
import AdminLayout from './admin/AdminLayout'
import Overview from './admin/Overview'
import Orders from './admin/Orders'
import MenuItems from './admin/MenuItems'
import Categories from './admin/Categories'
import AdminReservations from './admin/Reservations'
import Customers from './admin/Customers'
import Reviews from './admin/Reviews'
import Analytics from './admin/Analytics'
import Reports from './admin/Reports'
import Settings from './admin/Settings'
import AdminLogin from './pages/AdminLogin'

import './App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ordering" element={<ProtectedRoute><Ordering /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Overview />} />
              <Route path="orders" element={<Orders />} />
              <Route path="menu" element={<MenuItems />} />
              <Route path="categories" element={<Categories />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  </LanguageProvider>
  )
}

export default App
