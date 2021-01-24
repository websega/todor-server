import { Schema, model, Document } from 'mongoose';

export interface IUserSchema extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

const User = model<IUserSchema>('User', UserSchema);

export default User;
