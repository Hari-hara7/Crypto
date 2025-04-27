import { useState } from "react";
import { createBlog } from "../api/blogApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPenNib, FaRegFileAlt, FaPaperPlane } from "react-icons/fa";

const CreateBlog = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('⚠️ You must be logged in!');
      return;
    }
    try {
      await createBlog(form, user.token);
      navigate("/home");
    } catch (error) {
      setError('❌ Failed to create blog! Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-r from-gray-800 to-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-teal-400 flex items-center justify-center gap-2">
          <FaPenNib /> Create Blog
        </h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        {/* Title Input */}
        <div className="relative">
          <FaRegFileAlt className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            className="pl-10 pr-4 py-3 w-full bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
          />
        </div>

        {/* Content Input */}
        <div className="relative">
          <FaPenNib className="absolute top-3 left-3 text-gray-400" />
          <textarea
            name="content"
            placeholder="Write your blog content..."
            value={form.content}
            onChange={handleChange}
            className="pl-10 pr-4 py-3 w-full h-40 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
        >
          <FaPaperPlane className="text-lg" />
          Post Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
