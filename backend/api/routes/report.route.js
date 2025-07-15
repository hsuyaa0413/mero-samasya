import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  geocode,
  getReports,
  getReportById,
  reverseGeocode,
  submitReport,
  getTodayReportsCount,
  markAsUrgent,
  rejectIssue,
} from '../controllers/report.controller.js';

const router = express.Router();
router.get('/geocode', geocode);
router.get('/reverse-geocode', reverseGeocode);

// authenticate all the routes after this middleware
router.use(isAuthenticated);

router.post('/submit-report', submitReport);
router.get('/get-reports', getReports);
router.get('/today-count', getTodayReportsCount);
router.get('/:id', getReportById);

router.get('/mark-urgent/:id', isAdmin, markAsUrgent);
router.get('/reject-issue/:id', isAdmin, rejectIssue);

export default router;
