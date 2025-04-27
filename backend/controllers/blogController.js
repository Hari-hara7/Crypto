const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
  const { title, content, image } = req.body;

  const blog = await Blog.create({
    title,
    content,
    image,
    author: req.user._id,
  });

  res.status(201).json(blog);
};

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('author', 'username');
  res.json(blogs);
};

const getSingleBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'username');
  if (blog) {
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

const likeBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  if (!blog.likes.includes(req.user._id)) {
    blog.likes.push(req.user._id);
    await blog.save();
  }
  res.json(blog);
};

const commentBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const comment = {
    user: req.user._id,
    text: req.body.text,
  };
  
  blog.comments.push(comment);
  await blog.save();
  
  res.json(blog);
};

module.exports = { createBlog, getAllBlogs, getSingleBlog, likeBlog, commentBlog };
