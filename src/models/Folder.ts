import { Schema, model, Document } from 'mongoose';

export type TaskType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  important: boolean;
  deleted: boolean;
};

export interface IFolderSchema extends Document {
  userId: string;
  name: string;
  colorId: string;
  tasks: Array<TaskType>;
}

const FolderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  colorId: { type: String, required: true },
  tasks: [],
});

const Folder = model<IFolderSchema>('Folder', FolderSchema);

export default Folder;
