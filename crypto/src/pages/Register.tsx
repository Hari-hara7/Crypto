import { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      setError("Error during registration!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-black to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <FaUserPlus className="text-teal-400 text-6xl animate-bounce mx-auto" />
        <h1 className="text-4xl font-bold text-teal-300 mt-4">Join Crypto Tracker 🚀</h1>
        <p className="text-gray-400 mt-2">Sign up to start tracking your crypto portfolio.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-80"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h2 className="text-2xl font-bold text-center text-teal-300 mb-6">Create Account</h2>
        {error && (
          <motion.p
            className="text-red-400 text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border border-teal-400 bg-transparent text-white p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border border-teal-400 bg-transparent text-white p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-teal-400 bg-transparent text-white p-2 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
          required
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-teal-500 hover:bg-teal-400 transition text-white w-full p-2 rounded font-semibold"
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Register;
