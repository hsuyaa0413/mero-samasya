import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          // 'this' only points on CREATE and SAVE!!!
          return val === this.password;
        },
        message: 'Passwords must match!',
      },
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['citizen', 'authority'],
      default: 'citizen',
    },
    localBody: {
      type: String,
      required: function () {
        return this.role === 'authority';
      },
    },
    idCard: {
      type: String,
      required: function () {
        return this.role === 'authority';
      },
    },

    // --- Timestamps ---
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
