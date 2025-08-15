import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Auth from "../pages/Auth/Auth";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
