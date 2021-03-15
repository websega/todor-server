/* eslint-disable no-console */
import path from 'path';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import config from 'config';
import fileUpload from 'express-fileupload';

import authRouter from './routes/auth.routes';
import folderRouter from './routes/folder.routes';

import corsMiddleware from './middleware/cors.middleware';
import filePathMiddleware from './middleware/filepath.middleware';

const app: Application = express();

const port = process.env.PORT || config.get<number | string>('serverPort');

const dbUrl: string = config.get<string>('dbUrl');

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(filePathMiddleware(path));
app.use(express.json());
app.use(express.static('static'));
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
    process.exitCode = 1;
  }
};

start();
