import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    mediaUrls: {
      type: Array,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'roads',
        'utilities',
        'waste',
        'safety',
        'lighting',
        'parks',
        'other',
      ],
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
