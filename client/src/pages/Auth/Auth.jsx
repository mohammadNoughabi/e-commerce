import { useState } from "react";
import api from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginSuccess,
  loginFailure,
  setLoading,
} from "../../store/auth/authSlice";

const Auth = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    if (!formData.email) return "Email is required.";
    if (
      (activeForm === "login" || activeForm === "register") &&
      !formData.password
    )
      return "Password is required.";
    if (activeForm === "register") {
      if (!formData.confirmPassword) return "Confirm Password is required.";
      if (formData.password !== formData.confirmPassword)
        return "Passwords do not match.";
    }
    return null;
  };

  const handleAuthSuccess = async () => {
    try {
      // Fetch fresh user data from token
      const res = await api.get("/api/auth/validate-token");
      dispatch(
        loginSuccess({
          userId: res.data.userId,
          userRole: res.data.userRole,
        })
      );
      navigate("/profile");
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Auth failed"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validateFields();
    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    try {
      dispatch(setLoading());

      if (activeForm === "login") {
        await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      } else if (activeForm === "register") {
        await api.post("/api/auth/register", {
          email: formData.email,
          password: formData.password,
        });
      } else if (activeForm === "forgot") {
        await api.post("/api/auth/forgot-password", {
          email: formData.email,
        });
        alert("Password reset link sent to your email.");
        return;
      }

      await handleAuthSuccess();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      dispatch(
        loginFailure(error.response?.data?.message || "Something went wrong")
      );
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-dark-blue p-6">
            <h2 className="text-white text-2xl font-bold text-center">
              {activeForm === "login" && "Login"}
              {activeForm === "register" && "Create Account"}
              {activeForm === "forgot" && "Reset Password"}
            </h2>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-dark-blue text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              {(activeForm === "login" || activeForm === "register") && (
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-dark-blue text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange"
                    required
                    autoComplete="current-password"
                  />
                </div>
              )}

              {/* Confirm Password */}
              {activeForm === "register" && (
                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-dark-blue text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent-orange"
                    required
                    autoComplete="password"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent-orange text-dark-blue font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                {isLoading
                  ? "Please wait..."
                  : activeForm === "login"
                  ? "Login"
                  : activeForm === "register"
                  ? "Register"
                  : "Send Reset Link"}
              </button>
            </form>

            {/* Links */}
            <div className="mt-4 text-center text-sm">
              {activeForm !== "login" && (
                <p className="text-dark-blue">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveForm("login")}
                    className="text-accent-orange hover:underline font-medium cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              )}

              {activeForm !== "register" && (
                <p className="text-dark-blue mt-2">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveForm("register")}
                    className="text-accent-orange hover:underline font-medium cursor-pointer"
                  >
                    Register
                  </button>
                </p>
              )}

              {activeForm === "login" && (
                <p className="text-dark-blue mt-2">
                  <button
                    onClick={() => setActiveForm("forgot")}
                    className="text-accent-orange hover:underline font-medium cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
