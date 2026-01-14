const Post = require('../models/Post');

// List with pagination and search
exports.listPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = 5;
    const q = (req.query.q || '').trim();
    const filter = q ? { $or: [{ title: new RegExp(q, 'i') }, { tags: q.toLowerCase() }] } : {};
    const [posts, count] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Post.countDocuments(filter)
    ]);
    res.render('index', {
      posts,
      page,
      totalPages: Math.ceil(count / limit),
      q
    });
  } catch (err) {
    next(err);
  }
};

// Show single post
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).render('error', { message: 'Post not found' });
    res.render('post', { post });
  } catch (err) {
    next(err);
  }
};

// Create form
exports.createForm = (req, res) => res.render('create');

// Create post
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, tags, excerpt } = req.body;
    const post = await Post.create({
      title,
      content,
      excerpt,
      tags: (tags || '')
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    });
    res.redirect(`/post/${post.slug}`);
  } catch (err) {
    next(err);
  }
};

// Edit form
exports.editForm = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).render('error', { message: 'Post not found' });
    res.render('edit', { post });
  } catch (err) {
    next(err);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const { title, content, tags, excerpt } = req.body;
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      {
        title,
        content,
        excerpt,
        tags: (tags || '')
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).render('error', { message: 'Post not found' });
    res.redirect(`/post/${post.slug}`);
  } catch (err) {
    next(err);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) return res.status(404).render('error', { message: 'Post not found' });
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};