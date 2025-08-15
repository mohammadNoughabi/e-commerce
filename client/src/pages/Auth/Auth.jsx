import { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [activeForm, setActiveForm] = useState("login"); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const apiBase = import.meta.env.VITE_API_BASE;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeForm === "login") {
        if (!formData.email || !formData.password) {
          alert("Please fill in all fields");
          return;
        }

        const response = await axios.post(`${apiBase}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        console.log(response)
        
      } else if (activeForm === "register") {
        if (
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          alert("Please fill in all fields");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const response = await axios.post(`${apiBase}/api/auth/register`, {
          email: formData.email,
          password: formData.password,
        });

        console.log(response);
      } else if (activeForm === "forgot") {
        if (!formData.email) {
          alert("Please enter your email");
          return;
        }

        const response = await axios.post(
          `${apiBase}/api/auth/forgot-password`,
          {
            email: formData.email,
          }
        );

        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header with form switcher */}
          <div className="bg-dark-blue p-6">
            <h2 className="text-white text-2xl font-bold text-center">
              {activeForm === "login" && "Login"}
              {activeForm === "register" && "Create Account"}
              {activeForm === "forgot" && "Reset Password"}
            </h2>
          </div>

          {/* Form content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Email field (all forms) */}
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
                />
              </div>

              {/* Password field (login & register) */}
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
                    autoComplete="password"
                  />
                </div>
              )}

              {/* Confirm Password (register only) */}
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
                    autoComplete="current-password"
                  />
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-accent-orange text-dark-blue font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 cursor-pointer"
              >
                {activeForm === "login" && "Login"}
                {activeForm === "register" && "Register"}
                {activeForm === "forgot" && "Send Reset Link"}
              </button>
            </form>

            {/* Form switcher links */}
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

              {activeForm !== "forgot" && activeForm === "login" && (
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
