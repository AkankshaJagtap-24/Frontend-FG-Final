const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for forum posts
let posts = [
  {
    id: "post-1",
    author: {
      name: "John Doe",
      initials: "JD",
      color: "cyan",
    },
    time: "10 minutes ago",
    title: "Main Street Bridge Flooded",
    content: "The Main Street bridge is completely flooded. Water is about 2 feet deep. Avoid this area and use the Highway 7 bypass instead.",
    likes: 12,
    comments: 3,
  }
];

// Get all forum posts
app.get('/api/forum', (req, res) => {
  res.json({ success: true, posts });
});

// Add new forum post
app.post('/api/add_forum_post', (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    author: {
      name: "User", // In a real app, get this from token
      initials: "U",
      color: "cyan",
    },
    time: "Just now",
    title,
    content,
    likes: 0,
    comments: 0,
  };

  posts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});