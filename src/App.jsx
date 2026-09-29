import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Dashboard & Core Modules
import Dashboard from './pages/dashboard/Dashboard'
import MovieList from './pages/movies/MovieList'
import TheatreList from './pages/theatres/TheatreList'

// Future Module placeholders
import ComingSoon from './components/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Application routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/theatres" element={<TheatreList />} />
            <Route path="/seats" element={<ComingSoon title="Module 5: Seat Selection" />} />
            <Route path="/booking" element={<ComingSoon title="Module 6: Ticket Booking" />} />
            <Route path="/payment" element={<ComingSoon title="Module 7: Payment Page" />} />
            <Route path="/history" element={<ComingSoon title="Module 8: Booking History" />} />
            <Route path="/reports" element={<ComingSoon title="Module 9: Reports & Analytics" />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  )
}
