const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'users' });

// Ensure Mongoose returns `id` instead of `_id`
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();  // Convert `_id` to string
    delete ret._id;
    delete ret.__v;
    delete ret.password;  // Never return password in API
  }
});

module.exports = mongoose.model('User', UserSchema);
