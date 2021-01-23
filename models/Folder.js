const { Schema, model, ObjectId } = require('mongoose');

const Folder = new Schema({
  user_id: { type: ObjectId, ref: 'User'},
  name: { type: String, required: true },
  color_id: { type: String, required: true },
  tasks: [],
});

module.exports = model('Folder', Folder);
