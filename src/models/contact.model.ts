import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email?: string;
  phone: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone: string;
  tags?: string[];
  isFavorite?: boolean;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  tags: { type: [String], default: [] },
  isFavorite: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);