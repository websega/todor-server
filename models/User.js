const { Schema, model, ObjectId } = require('mongoose');

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  folders: [{ type: ObjectId, ref: 'Folder' }],
});

module.exports = model('User', User);
