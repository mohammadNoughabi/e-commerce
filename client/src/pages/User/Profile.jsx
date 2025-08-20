import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth/authSlice";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { openModal } from "../../store/Modal/modalSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, userRole } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    try {
      setLoading(true);
      await api.post("/api/auth/logout"); // cookie cleared on server
      dispatch(logout()); // Redux state reset
      dispatch(
        openModal({
          title: "Logout Success",
          message: "Logged out successfully!",
          buttonText: "OK",
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      dispatch(
        openModal({
          title: "logout failed",
          message: "try again!!",
          buttonText: "OK",
        })
      );
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Profile header */}
        <h2 className="text-dark-blue text-3xl font-bold mb-4 text-center">
          Profile
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Welcome,{" "}
          <span className="font-semibold text-accent-orange">
            {userId || "Guest"}
          </span>
          <br />
          Role:{" "}
          <span className="font-semibold text-dark-blue">
            {userRole || "N/A"}
          </span>
        </p>

        {/* Logout button */}
        <button
          onClick={logoutUser}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-dark-blue bg-accent-orange cursor-pointer
          hover:bg-opacity-90 transition-all duration-200 shadow-md 
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
