import express from 'express';
import upload from '../config/multer.js';
import { changeJobApplicantsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJob, loginCompany, postJob, registerCompany } from '../controller/companyController.js';
import { protectCompany } from '../middlewares/AuthMiddleware.js';


const router = express.Router()


router.post("/register",upload.single("image"),registerCompany)


router.post("/login",loginCompany)


router.get("/company",protectCompany,getCompanyData)


router.post("/post-job",protectCompany,postJob)


router.get("/applicants",protectCompany,getCompanyJobApplicants)


router.get("/list-jobs",protectCompany, getCompanyPostedJob)



router.post("/change-status",protectCompany,changeJobApplicantsStatus)


router.post("/change-visibility",protectCompany,changeVisibility)

export default router