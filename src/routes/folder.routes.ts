import { Router, Request, Response } from 'express';
import config from 'config';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Folder, { TaskType } from '../models/Folder';
import User from '../models/User';
import authMiddleware from '../middleware/auth.middleware';

const folderRouter = Router();

type AddTaskBodyType = {
  userId: string;
  name: string;
  colorId: string;
};

folderRouter.post('/add-folder', async (req: Request, res: Response) => {
  try {
    const { userId, name, colorId }: AddTaskBodyType = req.body;

    const folder = new Folder({ userId, name, colorId });

    await folder.save();

    return res.json({
      message: `A folder named ${name} has been created`,
      folder,
    });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

folderRouter.get('/get-all/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const folders = await Folder.find({ userId });

    if (!folders.length) {
      return res.status(404).json({ message: 'Folders not found!' });
    }

    return res.json({ folders });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

folderRouter.post('/add-task/', async (req: Request, res: Response) => {
  try {
    const folderId: string = req.query.folderId as string;
    const newTask: TaskType = req.body;

    const folder = await Folder.findOne({ _id: folderId });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found!' });
    }

    folder.tasks.push(newTask);

    await folder.save();

    return res.send({ message: 'Task was been added!' });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

type DescriptionBodyType = {
  descriptionText: string;
};

folderRouter.post(
  '/add-task-description/',
  async (req: Request, res: Response) => {
    try {
      const folderId: string = req.query.folderId as string;
      const taskId: string = req.query.taskId as string;
      const { descriptionText }: DescriptionBodyType = req.body;

      const folder = await Folder.findOne({ _id: folderId });

      if (!folder) {
        return res
          .status(404)
          .json({ message: 'Folder not found in database!' });
      }

      const newTasks = folder.tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, description: descriptionText };
        }
        return task;
      });

      folder.tasks = newTasks;

      await Folder.updateOne({ _id: folderId }, folder);

      return res.send({ message: 'Task description was updated' });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

folderRouter.patch('/task-property/', async (req: Request, res: Response) => {
  try {
    const folderId: string = req.query.folderId as string;
    const taskId: string = req.query.taskId as string;
    const propName: keyof TaskType = req.query.propName as keyof TaskType;

    const folder = await Folder.findOne({ _id: folderId });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found in database!' });
    }

    const newTasks = folder.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, [propName]: !task[propName] };
      }
      return task;
    });

    folder.tasks = newTasks;

    await Folder.updateOne({ _id: folderId }, folder);

    return res.send({ message: `Task property ${propName} was be toggled` });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

folderRouter.patch(
  '/clear-deleted-tasks/',
  async (req: Request, res: Response) => {
    try {
      const folderId: string = req.query.folderId as string;

      const folder = await Folder.findOne({ _id: folderId });

      if (!folder) {
        return res
          .status(404)
          .json({ message: 'Folder not found in database!' });
      }

      const newTasks = folder.tasks.filter((task) => !task.deleted);

      folder.tasks = newTasks;

      await Folder.updateOne({ _id: folderId }, folder);

      return res.send({ message: 'Task was marked as deleted' });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

folderRouter.delete('/delete-folder/', async (req: Request, res: Response) => {
  try {
    const folderId: string = req.query.folderId as string;

    await Folder.deleteOne({ _id: folderId });

    return res.send({ message: 'Folder was  deleted' });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

type UserType = {
  id: string;
};

interface IAvatarRequest extends Request {
  files?: any;
  user?: UserType;
}

folderRouter.post(
  '/avatar/',
  authMiddleware,
  async (req: IAvatarRequest, res: Response) => {
    if (!req.user) {
      return null;
    }
    try {
      const { file } = req.files;

      const user = await User.findById({ _id: req.user.id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const avatarName = `${uuidv4()}.jpg`;

      const urlApp = process.env.APP_URL
        ? `${process.env.APP_URL}static`
        : config.get('staticPath');
        console.log(urlApp);
        

      file.mv(`${urlApp}\\${avatarName}`);

      user.avatar = avatarName;

      await user.save();

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Upload avatar error' });
    }
  }
);

folderRouter.delete(
  '/avatar-delete/',
  authMiddleware,
  async (req: IAvatarRequest, res: Response) => {
    if (!req.user) {
      return null;
    }
    try {
      const user = await User.findById({ _id: req.user.id });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const urlApp = process.env.APP_URL
        ? `${process.env.APP_URL}static`
        : config.get('staticPath');

      fs.unlinkSync(`${urlApp}\\${user.avatar}`);

      user.avatar = '';

      await user.save();

      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Delete avatar error' });
    }
  }
);

export default folderRouter;
