require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const router = require('./router/route');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: frontendUrls,
    credentials: true,
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/', router);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
