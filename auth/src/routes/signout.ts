import express from 'express';

const router = express.Router();

router.get('/api/users/signout', async (req, res) => {
  res.send('Hallo!');
});

export { router as signOutRouter };
