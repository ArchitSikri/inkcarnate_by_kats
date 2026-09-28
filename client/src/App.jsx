import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

/**
 * Enhanced lazy loader with preloading capabilities.
 * Allows routes to be preloaded in idle time or on hover for 0ms transition delay.
 */
const lazyWithPreload = (factory) => {
  const Component = React.lazy(factory);
  Component.preload = factory;
  return Component;
};

// Dynamic Route Chunk Definitions
const Home = lazyWithPreload(() => import('./pages/Home'));
const UserLogin = lazyWithPreload(() => import('./pages/UserLogin'));
const UserRegister = lazyWithPreload(() => import('./pages/UserRegister'));
const UserHomeDashboard = lazyWithPreload(() => import('./pages/UserHomeDashboard'));
const AdminLogin = lazyWithPreload(() => import('./pages/AdminLogin'));
const Adminregister = lazyWithPreload(() => import('./pages/Adminregister'));
const AdminHomeDashboard = lazyWithPreload(() => import('./pages/AdminHomeDashboard'));
const NotFound = lazyWithPreload(() => import('./pages/NotFound'));

// Sleek, high-performance suspense fallback spinner/progress bar
const PageLoader = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse w-3/4"></div>
    </div>
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      <span className="text-xs font-mono text-slate-400 tracking-wider">LOADING ROUTE...</span>
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    // Intelligent Background Preloading: Fetch route chunks during idle browser time
    const preloadAllRoutes = () => {
      Home.preload();
      UserLogin.preload();
      UserRegister.preload();
      UserHomeDashboard.preload();
      AdminLogin.preload();
      Adminregister.preload();
      AdminHomeDashboard.preload();
      NotFound.preload();
    };

    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(preloadAllRoutes, { timeout: 2000 });
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(preloadAllRoutes, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main Landing Route */}
          <Route path="/" element={<Home />} />

          {/* User Auth & Dashboard Routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/dashboard" element={<UserHomeDashboard />} />
          <Route path="/userhomedashboard" element={<UserHomeDashboard />} />

          {/* Admin Auth & Dashboard Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<Adminregister />} />
          <Route path="/admin/dashboard" element={<AdminHomeDashboard />} />

          {/* Legacy or Redirect Aliases for Fast Fallback */}
          <Route path="/login" element={<Navigate to="/user/login" replace />} />
          <Route path="/register" element={<Navigate to="/user/register" replace />} />
          <Route path="/dashboard" element={<Navigate to="/userhomedashboard" replace />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
