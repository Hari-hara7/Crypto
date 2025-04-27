import { useEffect, useState } from "react";
import { getAllBlogs } from "../api/blogApi";
import BlogCard from "../components/BlogCard";
import { motion } from "framer-motion";

const Homee = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogs()
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-black text-white">
        <div className="text-6xl text-cyan-500 animate-pulse mb-4">📝</div>
        <p className="text-xl text-teal-400 animate-pulse">Fetching Blogs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] p-6 bg-gradient-to-b from-gray-900 to-black">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
        Latest Blogs
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {blogs.length === 0 ? (
          <p className="text-gray-300 text-center w-full">No blogs posted yet!</p>
        ) : (
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Homee;
