import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import Category from "./pages/Category";
import Income from "./pages/income";
import Expense from "./pages/expense";
import Filter from "./pages/filter";
import Settings from "./pages/Settings";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Activate from "./pages/activate";
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