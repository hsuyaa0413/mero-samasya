import axios from 'axios';
import Report from '../models/report.model.js';

export const submitReport = async (req, res, next) => {
  const {
    title,
    description,
    mediaUrls,
    location,
    lat,
    lng,
    urgency,
    category,
    status,
  } = req.body;

  const userId = req.user.id;

  const newReport = new Report({
    title,
    description,
    mediaUrls,
    location,
    lat,
    lng,
    urgency,
    category,
    status,
    reportedBy: userId,
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

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).populate({
      path: 'reportedBy',
    });

    res.status(200).json({
      status: 'success',
      message: 'Reports fetched successfully!',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  const id = req.params.id;

  const issue = await Report.findById(id).populate({
    path: 'reportedBy',
  });
  if (!issue) return next(errorHandler(404, 'Issue not found!'));

  return res.status(200).json({
    status: 'success',
    message: 'Issue report found successfully!',
    issue,
  });
};

export const getTodayReportsCount = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfDay); // Start with today's start
    endOfToday.setDate(startOfDay.getDate() + 1);

    const count = await Report.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfToday,
      },
    });

    res.status(200).json({
      status: 'success',
      count,
    });
  } catch (error) {
    return next(error);
  }
};

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const CUSTOM_USER_AGENT = 'MeroSamasya/1.0 (merosamasya@gmail.com)';

// Geocoding Endpoint (Address to Coordinates)
export const geocode = async (req, res, next) => {
  const { q } = req.query; // Address query

  if (!q || typeof q !== 'string') {
    return res
      .status(400)
      .json({ message: 'Address query parameter "q" is required.' });
  }

  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q,
        format: 'json',
        addressdetails: 1,
        limit: 1, // We usually want the top result
      },
      headers: {
        'User-Agent': CUSTOM_USER_AGENT,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      res.json({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        displayName: display_name,
      });
    } else {
      return next(errorHandler(404, 'Location not found.'));
    }
  } catch (error) {
    next(error);
  }
};

// Reverse Geocoding Endpoint (Coordinates to Address)
export const reverseGeocode = async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
    return next(
      errorHandler(
        400,
        'Latitude (lat) and Longitude (lon) query parameters are required.'
      )
    );
  }

  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': CUSTOM_USER_AGENT,
      },
    });

    if (response.data && response.data.display_name) {
      res.json({
        address: response.data.display_name,
        fullDetails: response.data.address, // Contains road, city, country etc.
        lat: parseFloat(response.data.lat), // Return validated lat/lon
        lon: parseFloat(response.data.lon),
      });
    } else {
      return next(
        errorHandler(404, 'Address not found for the given coordinates.')
      );
    }
  } catch (error) {
    next(error);
  }
};

export const markAsUrgent = async (req, res, next) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findByIdAndUpdate(
      reportId,
      { urgency: 'critical' },
      { new: true }
    );

    if (!report) return next(errorHandler(404, 'Report not found!'));

    return res.status(200).json({
      status: 'success',
      message: 'Report marked as urgent!',
      report,
    });
  } catch (e) {
    next(errorHandler(e.status || 500, e.message || 'Server error'));
  }
};

export const rejectIssue = async (req, res, next) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) return next(errorHandler(404, 'Report not found!'));

    return res.status(200).json({
      status: 'success',
      message: 'Report rejected and deleted successfully!',
    });
  } catch (e) {
    next(errorHandler(e.status || 500, e.message || 'Server error'));
  }
};
export const updateReportStatus = async (req, res, next) => {
  const reportId = req.params.id;
  const { status } = req.body;

  // Validate status
  if (!['pending', 'inProgress', 'resolved'].includes(status)) {
    return next(errorHandler(400, 'Invalid status provided.'));
  }

  try {
    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    ).populate('reportedBy');

    if (!report) {
      return next(errorHandler(404, 'Report not found!'));
    }

    return res.status(200).json({
      status: 'success',
      message: 'Report status updated successfully!',
      data: report,
    });
  } catch (error) {
    next(errorHandler(500, error.message || 'Server error'));
  }
};
