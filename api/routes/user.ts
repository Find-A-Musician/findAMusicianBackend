import express from 'express';
import {HttpError} from '@typing';
import {Response, Request} from 'express';
import type {operations} from '@schema';
type getUsers = operations['getUser'];
type getUsersByIdBody = getUsers['requestBody']['content']['application/json'];
type getUserByIdPath = getUsers['parameters']['path'];
type getUserByIdResponse =
  getUsers['responses']['200']['content']['application/json'];

const router = express.Router();

router.post(
    '/:other/:test',
    (
        req: Request<getUserByIdPath, {}, getUsersByIdBody, {}>,
        res: Response<getUserByIdResponse | HttpError, {}>,
    ) => {
      console.log(req.params.other);
      console.log(req.params.test);
      console.log(req.body.id);

      res.status(200).json({
        email: 'john.doe@gmail.com',
        givenName: 'John',
        familyName: 'Doe',
        phone: '+33766072513',
        facebookUrl: 'https://facebook/id',
        twitterUrl: 'https://twitter/id',
        instagramUrl: 'https://instagram/id',
        promotion: 'L1',
        location: 'Douai',
      });
    },
);

export default router;
