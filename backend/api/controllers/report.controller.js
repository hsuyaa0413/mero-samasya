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
    category,
    status,
  } = req.body;

  const newReport = new Report({
    title,
    description,
    mediaUrls,
    location,
    lat,
    lng,
    category,
    status,
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
    const reports = await Report.find();
    res.status(200).json({
      status: 'success',
      message: 'Reports fetched successfully!',
      data: reports,
    });
  } catch (error) {
    next(error);
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
      res.status(404).json({ message: 'Location not found.' });
    }
  } catch (error) {
    next(error);
  }
};

// Reverse Geocoding Endpoint (Coordinates to Address)
export const reverseGeocode = async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon || typeof lat !== 'string' || typeof lon !== 'string') {
    return res.status(400).json({
      message:
        'Latitude (lat) and Longitude (lon) query parameters are required.',
    });
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
      res
        .status(404)
        .json({ message: 'Address not found for the given coordinates.' });
    }
  } catch (error) {
    next(error);
  }
};
