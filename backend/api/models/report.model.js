import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    mediaUrls: {
      type: Array,
      required: [true, 'At least one media URL is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    urgency: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Urgency must be one of: low, medium, high, critical',
      },
      required: [true, 'Urgency level is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['water', 'road', 'electricity', 'waste_sanitation', 'others'],
        message: 'Invalid category selected',
      },
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'inProgress', 'resolved'],
        message: 'Status must be one of: pending, inProgress, resolved',
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter of the issue is required'],
    },
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
