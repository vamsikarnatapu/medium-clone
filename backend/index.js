require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Import models
const User = require('./models/User');
const Article = require('./models/Article');
const Comment = require('./models/Comment');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medium-clone',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
});

const upload = multer({ storage: storage });

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ userId: user._id }, process.env.SESSION_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required' });
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.SESSION_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Article routes
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article with image upload
app.post('/api/articles', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, body, tags } = req.body;
  if (!title || !body) return res.status(400).json({ message: 'Title and body required' });
  
  try {
    const articleData = { 
      title, 
      body, 
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [], 
      author: req.userId 
    };
    
    if (req.file) {
      articleData.image = req.file.path;
    }
    
    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article with image upload
app.put('/api/articles/:id', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, body, tags } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.author.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    
    article.title = title || article.title;
    article.body = body || article.body;
    article.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : article.tags;
    article.updatedAt = Date.now();
    
    if (req.file) {
      article.image = req.file.path;
    }
    
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/articles/:id', authMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Not found' });
    if (article.author.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get articles by tag
app.get('/api/articles/tag/:tag', async (req, res) => {
  try {
    const articles = await Article.find({ tags: req.params.tag })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
  try {
    const articles = await Article.find({}, 'tags');
    const allTags = articles.reduce((tags, article) => {
      return tags.concat(article.tags || []);
    }, []);
    const uniqueTags = [...new Set(allTags)].sort();
    res.json(uniqueTags);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get articles by user
app.get('/api/users/:username/articles', async (req, res) => {
  try {
    const user = await User.findOne({ 
      $or: [{ name: req.params.username }, { email: req.params.username }] 
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const articles = await Article.find({ author: user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Comment routes
app.post('/api/articles/:articleId/comments', authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text required' });
  
  try {
    const comment = await Comment.create({
      text,
      author: req.userId,
      article: req.params.articleId
    });
    
    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/articles/:articleId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/comments/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    if (comment.author.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' });
    
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Medium Clone API is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
