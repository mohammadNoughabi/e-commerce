import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";
import { login as loginAction } from "../../store/auth/authSlice";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeForm, setActiveForm] = useState("login"); // login | register | forgotPass
  const [step, setStep] = useState(1); // for multi-step flows
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    otp: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // -------------------- Login --------------------
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Backend returns token
      if (res.data.token) {
        // validate token to get userId + role
        const validateRes = await api.get("/api/auth/validate-token");

        dispatch(
          loginAction({
            userId: validateRes.data.userId,
            userRole: validateRes.data.userRole,
          })
        );
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Register --------------------
  const handleRegister = async () => {
    try {
      if (step === 1) {
        if (formData.password !== formData.repeatPassword) {
          return alert("Passwords do not match");
        }

        // send OTP to email
        const res = await api.post("/api/auth/generate-otp", {
          email: formData.email,
        });
        alert(res.data.message);
        setStep(2);
      } else if (step === 2) {
        // verify OTP
        const verify = await api.post("/api/auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });

        if (verify.data.verified) {
          // now create user
          const reg = await api.post("/api/auth/register", {
            email: formData.email,
            password: formData.password,
          });

          if (reg.data.token) {
            const validateRes = await api.get("/api/auth/validate-token", {
              withCredentials: true,
            });
            dispatch(
              loginAction({
                userId: validateRes.data.userId,
                userRole: validateRes.data.userRole,
              })
            );
            navigate("/");
          }
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // -------------------- Forgot Password --------------------
  const handleForgotPass = async () => {
    try {
      if (step === 1) {
        // request OTP
        const res = await api.post("/api/auth/generate-otp", {
          email: formData.email,
        });
        alert(res.data.message);
        setStep(2);
      } else if (step === 2) {
        // verify OTP
        const verify = await api.post("/api/auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });
        if (verify.data.verified) {
          alert("OTP verified. Implement reset password form next.");
          // here you would show new password fields and call /change-pass
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  // -------------------- Handle Submit --------------------
  const handleSubmit = () => {
    if (activeForm === "login") handleLogin();
    if (activeForm === "register") handleRegister();
    if (activeForm === "forgotPass") handleForgotPass();
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form tabs */}
          <div className="flex border-b border-light-gray">
            {["login", "register", "forgotPass"].map((form) => (
              <button
                key={form}
                className={`flex-1 py-3 px-4 font-medium text-center transition-colors cursor-pointer whitespace-nowrap ${
                  activeForm === form
                    ? "text-accent-orange border-b-2 border-accent-orange"
                    : "text-dark-blue hover:bg-light-gray"
                }`}
                onClick={() => {
                  setActiveForm(form);
                  setStep(1);
                }}
              >
                {form === "login" && "Login"}
                {form === "register" && "Register"}
                {form === "forgotPass" && "Forgot Password"}
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-dark-blue mb-6 text-center">
              {activeForm === "login" && "Welcome Back"}
              {activeForm === "register" && "Create Account"}
              {activeForm === "forgotPass" && "Reset Password"}
            </h2>

            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-dark-blue mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-accent-orange"
                required
              />
            </div>

            {/* Password (login/register step1) */}
            {(activeForm === "login" ||
              (activeForm === "register" && step === 1)) && (
              <div className="mb-4">
                <label className="block text-dark-blue mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-accent-orange"
                  required
                />
              </div>
            )}

            {/* Repeat password (register step1) */}
            {activeForm === "register" && step === 1 && (
              <div className="mb-6">
                <label className="block text-dark-blue mb-2">
                  Repeat Password
                </label>
                <input
                  type="password"
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-accent-orange"
                  required
                />
              </div>
            )}

            {/* OTP (register step2 or forgotPass step2) */}
            {(step === 2 && (activeForm === "register" || activeForm === "forgotPass")) && (
              <div className="mb-6">
                <label className="block text-dark-blue mb-2">Enter Code Sent to your Email :</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-accent-orange"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-accent-orange text-dark-blue font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors cursor-pointer"
            >
              {loading ? "Please wait..." : 
                activeForm === "login"
                  ? "Login"
                  : activeForm === "register"
                  ? step === 1 ? "Send OTP" : "Verify & Register"
                  : step === 1 ? "Send code to email" : "Verify OTP"}
            </button>

            {activeForm === "login" && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveForm("forgotPass");
                    setStep(1);
                  }}
                  className="text-dark-blue hover:text-accent-orange transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
