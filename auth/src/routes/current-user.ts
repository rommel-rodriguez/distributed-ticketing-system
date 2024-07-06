import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@rrpereztickets/common';
import { requireAuth } from '@rrpereztickets/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  requireAuth,
  async (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
