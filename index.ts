/* eslint-disable no-console */
import path from 'path';
import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import config from 'config';
import fileUpload from 'express-fileupload';

import authRouter from './src/routes/auth.routes';
import folderRouter from './src/routes/folder.routes';

import corsMiddleware from './src/middleware/cors.middleware';

const app: Application = express();

const port = process.env.PORT || config.get<number>('serverPort');

const dbUrl: string = process.env.dbUrl || config.get<string>('dbUrl');

app.use(fileUpload({}));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.static('static'));
app.use('/api/auth', authRouter);
app.use('/api/folder', folderRouter);

app.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get('*', (_, res: any) => {
  let url = path.join(__dirname, '../client/dist/index.html', 'index.html');
  if (!url.startsWith('/')) url = url.substring(1);
  res.sendFile(url);
});

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
