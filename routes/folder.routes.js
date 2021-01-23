const Router = require('express');
const router = new Router();

const Folder = require('../models/Folder');

router.post('/add-folder', async (req, res) => {
  try {
    const { user_id, name, color_id } = req.body;

    const folder = new Folder({ user_id, name, color_id });

    await folder.save();

    return res.json({ message: `A folder named ${name} has been created` });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

router.get('/get-all/:user_id', async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const folders = await Folder.find({ user_id });

    if (!folders.length) {
      return res.status(404).json({ message: `Folders not found!` });
    }

    return res.json({ folders });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

router.post('/add-task/:folder_id', async (req, res) => {
  try {
    const folder_id = req.params.folder_id;
    const newTask = req.body;

    const folder = await Folder.findOne({ _id: folder_id });

    if (!folder) {
      return res.status(404).json({ message: `Folder not found!` });
    }

    folder.tasks.push(newTask);

    await folder.save();

    return res.json({ folder });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

router.put('/update-task/:folder_id', async (req, res) => {
  try {
    const folder_id = req.params.folder_id;
    const newTask = req.body;

    const folder = await Folder.findOne({ _id: folder_id });

    if (!folder) {
      return res.status(404).json({ message: `Folder not found!` });
    }

    folder.tasks.forEach((task) => {
      if (task._id === newTask._id) {
        task.title = newTask.title;
        task.description = newTask.description;
        task.date = newTask.date;
        task.completed = newTask.completed;
        task.important = newTask.important;
        task.deleted = newTask.deleted;
      }
    });

    await Folder.updateOne({ _id: folder_id }, folder);

    return res.json({ folder });
  } catch (error) {
    console.log(error);
    res.send({ message: 'Server error' });
  }
});

module.exports = router;
