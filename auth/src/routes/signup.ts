import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('The password must be between 4 and 20 characters long'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error('Invalid Email or Password');
    }

    throw new Error('Just Testing Error inside Sync Route Handler');

    res.send('Hallo!');
  }
);

export { router as signUpRouter };
