import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFailure,
  setLoading,
} from "../../store/auth/authSlice";
import api from "../../api/api";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const validateToken = async () => {
      dispatch(setLoading());
      try {
        const response = await api.get("/api/auth/get-existing-user", { withCredentials: true });
        dispatch(
          loginSuccess({
            userId: response.data.userId,
            userRole: response.data.userRole,
          })
        );
      } catch (error) {
        dispatch(loginFailure(error.message || "Session expired or invalid"));
      }
    };
    validateToken();
  }, [dispatch]);

  if(isLoading) return <div>Loading ...</div>

  return children;
};

export default AppInitializer;
