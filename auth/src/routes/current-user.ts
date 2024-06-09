import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', async (req, res) => {
  res.send('Hallo!');
});

export { router as currentUserRouter };
