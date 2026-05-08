// lib/database.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  jid: String,
  exp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  limit: { type: Number, default: 50 },
  premium: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  registered: { type: Boolean, default: false },
  name: String,
  age: Number,
  regTime: { type: Date, default: Date.now }
});

const groupSchema = new mongoose.Schema({
  jid: String,
  welcome: { type: Boolean, default: true },
  antilink: { type: Boolean, default: false },
  antispam: { type: Boolean, default: true },
  banned: { type: Boolean, default: false },
  message: { type: String, default: '' },
  // etc.
});

export const User = mongoose.model('User', userSchema);
export const Group = mongoose.model('Group', groupSchema);

export async function connectDB(uri) {
  await mongoose.connect(uri);
}

export function getDB() {
  return mongoose.connection;
}