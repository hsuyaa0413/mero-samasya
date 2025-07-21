import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Phone number is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords must match',
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['citizen', 'authority', 'admin'],
        message: 'Role must be one of: citizen, authority, admin',
      },
      default: 'citizen',
      required: [true, 'Role is required'],
    },
    approved: {
      type: Boolean,
      default: false,
      required: [
        function () {
          return this.role === 'authority';
        },
        'Approval status is required for authority role',
      ],
    },
    rejectedByAdmin: {
      type: Boolean,
      default: false,
      required: [
        function () {
          return this.role === 'authority';
        },
        'Rejection status is required for authority role',
      ],
    },
    localBody: {
      type: String,
      required: [
        function () {
          return this.role === 'authority';
        },
        'Local body is required for authority role',
      ],
    },
    idCard: {
      type: String,
      required: [
        function () {
          return this.role === 'authority';
        },
        'ID card is required for authority role',
      ],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
