import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";

// Lazy-loaded pages — each page is a separate chunk loaded on demand
const Home = lazy(() => import("./pages/Home"));
const Category = lazy(() => import("./pages/Category"));
const Income = lazy(() => import("./pages/Income"));
const Expense = lazy(() => import("./pages/Expense"));
const Filter = lazy(() => import("./pages/Filter"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Activate = lazy(() => import("./pages/Activate"));

const App = () => {
  const [isInitialized, setIsInitialized] = useState(() => {
    return sessionStorage.getItem('appInitialized') === 'true';
  });

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {!isInitialized && (
        <AppInitializer onComplete={() => {
          sessionStorage.setItem('appInitialized', 'true');
          setIsInitialized(true);
        }} />
      )}

      <BrowserRouter>
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center bg-gray-50">
            <PageLoader />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/activate" element={<Activate />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/category" element={<Category />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}
export default App;