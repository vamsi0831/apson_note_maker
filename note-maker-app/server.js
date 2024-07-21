const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');
const Note = require('./models/Note');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notesApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false
});

// Middleware to serve static files
app.use(express.static('public'));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

// Schedule job to delete notes older than 30 days
cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await Note.deleteMany({ deletedAt: { $lt: thirtyDaysAgo } });
});

// Start the server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${ PORT }`);
});