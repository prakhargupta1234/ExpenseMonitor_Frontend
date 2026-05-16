import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Filter from "./pages/Filter";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Activate from "./pages/Activate";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";


const App = () => {
  const [isInitialized, setIsInitialized] = useState(() => {
    return sessionStorage.getItem('appInitialized') === 'true';
  });

  return (
    <>
      <Toaster />

      {!isInitialized && (
        <AppInitializer onComplete={() => {
          sessionStorage.setItem('appInitialized', 'true');
          setIsInitialized(true);
        }} />
      )}

      <BrowserRouter>
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