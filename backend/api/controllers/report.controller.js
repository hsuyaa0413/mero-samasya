import Report from '../models/report.model.js';

export const submitReport = async (req, res, next) => {
  const { title, description, mediaUrls, location, category } = req.body;

  const newReport = new Report({
    title,
    description,
    mediaUrls,
    location,
    category,
  });
  try {
    await newReport.save();
    res
      .status(201)
      .json({ status: 'success', message: 'Report submitted successfully!' });
  } catch (error) {
    next(error);
  }
};
