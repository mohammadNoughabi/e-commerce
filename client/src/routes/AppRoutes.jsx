import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";
import Profile from "../pages/User/Profile";
import About from "../pages/About/About";
import Dashboard from "../pages/Admin/Dashboard";
import CategoryRoutes from "./CategoryRoutes";
import ProducRoutes from "./ProductRoutes";
import Shop from "../pages/Shop/Shop";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category/*" element={<CategoryRoutes />} />
        <Route path="/product/*" element={<ProducRoutes />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
