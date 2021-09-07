import express from 'express';
// import getUserById from '../controller/user';
import {operations} from '../../schema';
import {HttpError} from '../../typing';
import {Response, Request} from 'express';


type getUsers = operations['getUser'];
type getUsersByIdBody = getUsers['requestBody']['content']['application/json'];
type getUserByIdQuery = getUsers['parameters']['query'];
type getUserByIdResponse =
  getUsers['responses']['200']['content']['application/json'];


const router = express.Router();

router.post(
    '/',
    (
        req : Request<{}, {}, getUsersByIdBody, getUserByIdQuery>,
        res : Response<getUserByIdResponse | HttpError, {}>,
    ) => {
      console.log(`body : ${req.body.id}`);
      console.log(`params : ${req.query.test} and ${req.query.other}`);

      res.status(200).json({id: 'it worksq'});
    },
);

export default router;


