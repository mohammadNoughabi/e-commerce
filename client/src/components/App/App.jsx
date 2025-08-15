import AppRoutes from "../../routes/AppRoutes";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import api from "../../api/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure, logout } from "../../store/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  const { userId, userRole } = useSelector((state) => state.auth);
  console.log("userId:" + userId + "/", "userRole :" + userRole);

  const validateToken = async () => {
    try {
      const response = await api.get("/api/auth/validate-token");
      let { userId, userRole } = response.data;
      dispatch(loginSuccess({ userId, userRole }));
    } catch (error) {
      dispatch(loginFailure("Error in validating token:", error.message));
    }
  };

  useEffect(() => {
    validateToken();
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;
