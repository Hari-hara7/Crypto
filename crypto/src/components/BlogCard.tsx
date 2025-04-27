import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // Added icon

interface BlogCardProps {
  blog: any;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out p-6 sm:p-8 rounded-lg shadow-md cursor-pointer">
      <h2 className="text-cyan-400 text-2xl sm:text-3xl font-bold mb-4">
        {blog.title}
      </h2>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">
        {blog.content.slice(0, 100)}...
      </p>
      <Link
        to={`/blog/${blog._id}`}
        className="flex items-center gap-2 text-cyan-300 hover:text-cyan-400 font-semibold text-sm sm:text-base transition-colors duration-300"
      >
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-cyan-800 bg-cyan-200 rounded-full">
          Read More
        </span>
        <FaArrowRight className="mt-0.5" />
      </Link>
    </div>
  );
};

export default BlogCard;
