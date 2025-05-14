import express from 'express';
import {
  geocode,
  getReports,
  reverseGeocode,
  submitReport,
} from '../controllers/report.controller.js';

const router = express.Router();

router.post('/submit-report', submitReport);
router.get('/get-reports', getReports);
router.get('/geocode', geocode);
router.get('/reverse-geocode', reverseGeocode);

export default router;
