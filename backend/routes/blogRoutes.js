const express = require('express');
const { createBlog, getAllBlogs, getSingleBlog, likeBlog, commentBlog } = require('../controllers/blogController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getSingleBlog);
router.post('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, commentBlog);

module.exports = router;
