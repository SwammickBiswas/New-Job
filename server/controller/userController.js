import { v2 as cloudinary } from "cloudinary";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
export const getUserData = async (req, res) => {
  const userId = req.auth.userId; // Get userId from Clerk

  try {
    let user = await User.findById(userId);

    if (!user) {
      const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`, 
        },
      }).then(res => res.json());

      if (!clerkUser || clerkUser.error) {
        return res.status(404).json({ message: "User not found in Clerk", success: false });
      }
      user = new User({
        _id: userId, 
        email: clerkUser.email_addresses[0].email_address,
        name: clerkUser.first_name + " " + clerkUser.last_name,
        image: clerkUser.image_url,
        resume:""
      });

      await user.save();
    }

    res.status(200).json({ user, success: true });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const isAlreadyApplied = await JobApplication.find({ jobId, userId });
    if (isAlreadyApplied.length > 0) {
      return res
        .status(400)
        .json({ message: "Already applied for this job", success: false });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    await JobApplication.create({
      jobId,
      userId,
      companyId: jobData.companyId,
      date: Date.now(),
    });
    res.status(200).json({
      message: "Applied for the job successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getUserJobApplication = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();
    if (!applications) {
      return res
        .status(404)
        .json({ message: "No job applications found", success: false });
    }

    return res.status(200).json({ applications, success: true });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const resumeFile = req.file;
    const userData = await User.findById(userId);

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    return res
      .status(200)
      .json({ message: "Resume updated successfully", success: true });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
