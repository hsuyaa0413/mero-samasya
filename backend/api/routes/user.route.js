import express from 'express';
import { getUsers } from '../controllers/user.controller.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
router.get('/', isAdmin, getUsers);

export default router;
