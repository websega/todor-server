const express = require('express');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const config = require('config');
const authRouter = require('./routes/auth.routes');
const corsMiddleware = require('./middleware/cors.middleware');

// dotenv.config();

const app = express();
const PORT = config.get('serverPort');

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);

const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'));

    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });
  } catch (error) {}
};

start();
