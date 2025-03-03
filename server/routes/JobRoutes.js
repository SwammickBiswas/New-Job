import express from 'express';
import { getJobs, getJobsById } from '../controller/jobController.js';

const router = express.Router();


router.get("/",getJobs)
router.get("/:id",getJobsById)


export default router