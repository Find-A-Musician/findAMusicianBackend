import express from 'express';


const router = express.Router();

router.use('/', (req, res, next)=>{
  res.status(200).json({msg: 'test pass'});
});


export default router;
