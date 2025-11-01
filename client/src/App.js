import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateMoodBoard from './pages/CreateMoodBoard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateMoodBoard />
                </ProtectedRoute>
              }
            />
            {/* Default Route */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
