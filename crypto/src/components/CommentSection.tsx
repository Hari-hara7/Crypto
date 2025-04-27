import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";

interface CommentSectionProps {
  comments: { username: string; text: string }[];
}

const CommentSection = ({ comments }: CommentSectionProps) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    // Here, normally you'd post the comment to server
    console.log("New comment added:", newComment);
    setNewComment("");
    setShowCommentBox(false);
  };

  return (
    <div className="mt-6">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-teal-400">Comments</h3>
        {/* Comment Button */}
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex items-center gap-2 text-teal-300 hover:text-teal-400 transition-colors duration-300"
        >
          <FaCommentDots className="text-2xl" />
          <span className="font-semibold">Comment</span>
        </button>
      </div>

      {/* Comment Box */}
      {showCommentBox && (
        <div className="bg-gray-900 p-4 rounded-lg mb-6 shadow-md">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write your comment..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
          ></textarea>
          <button
            onClick={handleAddComment}
            className="mt-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
          >
            Post
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first!</p>
        ) : (
          comments.map((c, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-teal-400/30 transition-shadow duration-300"
            >
              <p className="text-teal-300 font-semibold">{c.username}</p>
              <p className="text-gray-300">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
