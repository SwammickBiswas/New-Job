import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const Applications = () => {
  const {user} = useUser()
  const {getToken} = useAuth()

  const [isEdit, setIsEdit] = React.useState(false);
  const [resume, setResume] = React.useState(null);
  const {backendUrl,userData,userApplications,fetchUserData,fetchUserApplication} = useContext(AppContext)

  const updateResume= async()=>{
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      const token = await getToken()
      const {data} = await axios.post(backendUrl+"/api/users/update-resume",
        formData,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      )

      if(data.success){
        await fetchUserData()
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }
  useEffect(()=>{
    if(user){
      fetchUserApplication()
    }
  },[user])

  return (
    <>
      <Navbar />
      <div className=" container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {isEdit || userData && userData.resume === "" ? (
            <>
              <label className="flex items-center" htmlFor="resumeUpload">
                <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id="resumeUpload"
                  onChange={(e) => setResume(e.target.files[0])}
                  type="file"
                  hidden
                  accept="application/pdf"
                />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button
                className="bg-green-100 border border-green-400 rounded px-4 py-2"
                onClick={updateResume}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <a
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                  href={userData?.resume}
                  target="_blank"
                >
                  Resume
                </a>
                <button
                  onClick={() => setIsEdit(true)}
                  className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Location
              </th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">
                Date
              </th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map((job, index) =>
              true ? (
                <tr key={index}>
                  <td className="py-3 px-4 flex items-center gap-2 border-b">
                    <img className="w-8 h-8" src={job.companyId.image} alt="" />
                    {job.companyId.name}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.jobId.title}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.jobId.location}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`${
                        job.status === "Accepted"
                          ? "bg-green-100"
                          : job.status === "Rejected"
                          ? "bg-red-100"
                          : "bg-blue-100"
                      } px-4 py-1.5 rounded`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>

      </div>
      <Footer/>
    </>
  );
};

export default Applications;
