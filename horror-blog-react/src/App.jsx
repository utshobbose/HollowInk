import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Article from './pages/Article';
import Login from './pages/Login';
import ReaderAccount from './pages/ReaderAccount';
import BrowseArchive from './pages/BrowseArchive';
import AuthorProfile from './pages/AuthorProfile';
import WriterDashboard from './pages/WriterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmissionGuidelines from './pages/SubmissionGuidelines';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg-base text-text-primary selection:bg-accent-blood selection:text-white">
          <Navbar />
          <Routes>
            {/* Page 1: Homepage */}
            <Route path="/" element={<Home />} />

            {/* Page 2: Login / Authentication */}
            <Route path="/login" element={<Login />} />

            {/* Page 3: Reader Account / Saved Reading List */}
            <Route
              path="/account"
              element={
                <ProtectedRoute allowedRoles={['reader', 'writer', 'admin']}>
                  <ReaderAccount />
                </ProtectedRoute>
              }
            />

            {/* Page 4: Browse Tales / Story Archive */}
            <Route path="/archive" element={<BrowseArchive />} />

            {/* Page 5: Author Profile */}
            <Route path="/author/:id" element={<AuthorProfile />} />

            {/* Page 6: Writer Dashboard */}
            <Route
              path="/writer"
              element={
                <ProtectedRoute allowedRoles={['writer', 'admin']}>
                  <WriterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Page 7: Admin Dashboard — Sanctum Sanctorum */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Reader & Information Pages */}
            <Route path="/article/:id" element={<Article />} />
            <Route path="/about" element={<About />} />
            <Route path="/submission-guidelines" element={<SubmissionGuidelines />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
