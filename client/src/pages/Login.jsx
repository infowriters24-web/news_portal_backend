import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";
import { baseURL } from "../config/Config";
import axios from "axios";
import toast from "react-hot-toast";
import StoreContext from "@/context/storeContext";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoader(true);
      const data = await axios.post(`${baseURL}/api/login`, formData);

      localStorage.setItem("news_token", data.data.token);
      toast.success(data.data.message);
      dispatch({
        type: "login success",
        payload: { token: data.data.token },
      });
      navigate("/dashboard");
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      console.log("Login Error:", error);
    }
    // console.log("Login Data:", formData);
    // এপিআই কল করবেন এখানে
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="Fact File 24"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Writers <span className="text-[#F7941D]">24</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Please login to your account
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@writers24.net"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D] focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                disabled={loader}
                type="submit"
                className="w-full bg-[#F7941D] hover:bg-[#E07D10] text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                {loader ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          {/* <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#F7941D] hover:text-[#E07D10] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div> */}
        </div>
        <p className="text-center text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} FACT FILE 24.com. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
