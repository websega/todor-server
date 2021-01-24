/* eslint-disable no-console */
import express, { Application } from 'express';
import mongoose from 'mongoose';
import config from 'config';

import authRouter from './routes/auth.routes';
import folderRouter from './routes/folder.routes';

import corsMiddleware from './middleware/cors.middleware';

const app: Application = express();
const port: number = config.get<number>('serverPort');
const dbUrl: string = config.get<string>('dbUrl');

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/folder', folderRouter);

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    return process.exit(1);
  }
};

start();
