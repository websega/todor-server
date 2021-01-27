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

folderRouter.post(
  '/add-task/:folderId',
  async (req: Request, res: Response) => {
    try {
      const { folderId } = req.params;
      const newTask = req.body;

      const folder = await Folder.findOne({ _id: folderId });

      if (!folder) {
        return res.status(404).json({ message: 'Folder not found!' });
      }

      folder.tasks.push(newTask);

      await folder.save();

      return res.json({ folder });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

folderRouter.put(
  '/update-task/:folderId',
  async (req: Request, res: Response) => {
    try {
      const { folderId } = req.params;
      const newTask: TaskType = req.body;

      const folder = await Folder.findOne({ _id: folderId });

      if (!folder) {
        return res.status(404).json({ message: 'Folder not found!' });
      }

      const taskIndex = folder.tasks.findIndex(
        (task) => task.id === newTask.id
      );

      folder.tasks = [
        ...folder.tasks.slice(0, taskIndex),
        newTask,
        ...folder.tasks.slice(taskIndex + 1),
      ];

      await Folder.updateOne({ _id: folderId }, folder);

      return res.json({ folder });
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Server error' });
    }
  }
);

export default folderRouter;
