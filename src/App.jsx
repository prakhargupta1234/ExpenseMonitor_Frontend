import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import Category from "./pages/category";
import Income from "./pages/income";
import Expense from "./pages/expense";
import Filter from "./pages/filter";
import Login from "./pages/login";
import Signup from "./pages/signup";


const App = () => {
  return (
    <>
    <Toaster/>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>

    
    </>
  )
}

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated? (
    <Navigate to="/dashboard" />
  ):(
    <Navigate to="/login" />
  );
}
export default App;