import { Router, Request, Response } from 'express';
import Folder, { TaskType } from '../models/Folder';

const folderRouter = Router();

folderRouter.post('/add-folder', async (req: Request, res: Response) => {
  try {
    const { userId, name, colorId } = req.body;

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

    return res.send({ message: 'Server error' });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

folderRouter.patch('/completed-task/', async (req: Request, res: Response) => {
  try {
    const folderId: string = req.query.folderId as string;
    const taskId: string = req.query.taskId as string;
    const { completed } = req.body;

    const folder = await Folder.findOne({ _id: folderId });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found in database!' });
    }

    const newTasks = folder.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed };
      }
      return task;
    });

    folder.tasks = newTasks;

    await Folder.updateOne({ _id: folderId }, folder);

    return res.send({ message: 'Task updated' });
  } catch (error) {
    console.log(error);
    return res.send({ message: 'Server error' });
  }
});

export default folderRouter;
