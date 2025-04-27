import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById, likeBlog, commentBlog } from "../api/blogApi";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');

  useEffect(() => {
    if (id) {
      getBlogById(id).then(res => setBlog(res.data)).catch(err => console.log(err));
    }
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login!');
    await likeBlog(blog._id, user.token);
    getBlogById(blog._id).then(res => setBlog(res.data));
  };

  const handleComment = async (e: any) => {
    e.preventDefault();
    if (!user) return alert('Please login!');
    await commentBlog(blog._id, { text: commentText + selectedEmoji }, user.token);
    setCommentText('');
    setSelectedEmoji('');
    getBlogById(blog._id).then(res => setBlog(res.data));
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setEmojiPickerVisible(false); // Close the emoji picker after selection
  };

  const emojiList = ['😊', '😂', '😍', '😎', '😭', '🤔', '😢'];

  if (!blog) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400">{blog.title}</h1>
        <p className="text-gray-300 my-4">{blog.content}</p>
        <div className="flex items-center gap-4 mt-4">
          <button onClick={handleLike} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded transition duration-300">
            Like ({blog.likes.length})
          </button>
        </div>

        <form onSubmit={handleComment} className="mt-6">
          <div className="flex gap-2 items-center">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="border p-2 w-full rounded bg-gray-800 text-white mb-2"
              required
            />
            <button
              type="button"
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
            >
              😊
            </button>
          </div>
          {emojiPickerVisible && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {emojiList.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded mt-4 transition duration-300">
            Comment
          </button>
        </form>

        <CommentSection comments={blog.comments} />
      </div>
    </div>
  );
};

export default BlogDetails;
