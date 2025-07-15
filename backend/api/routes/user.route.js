import express from 'express';
import {
  getUsers,
  approveAuthority,
  rejectAuthority,
} from '../controllers/user.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.get('/', isAdmin, getUsers);
router.get('/approve/:id', isAdmin, approveAuthority);
router.get('/reject/:id', isAdmin, rejectAuthority);

export default router;
